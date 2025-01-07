import { View, Text, TouchableOpacity, ImageBackground, Image, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native'
import React, { useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import CustomButton from '@/components/custom-button';
import axios from 'axios';
import { useGlobalContext } from '@/context/global-provider';
import Ionicons from '@expo/vector-icons/AntDesign';

const GenerateSong = () => {
    const router = useRouter();
    const { full_title, artist_names, song_art_image_url, lyrics } = useLocalSearchParams();
    const { setAudioUrl, setImageUrl, setLyrics } = useGlobalContext();
    const [isLoading, setIsLoading] = useState(false);

    const shouldPollRef = useRef(false);

    const handleGenerateSong = async () => {
        if (!lyrics) {
            Alert.alert('Please provide lyrics to generate a song.');
            return;
        }
        
        try {
            setIsLoading(true);
            shouldPollRef.current = true; // Start polling
        
            
            const taskResponse = await axios.post('http://192.168.1.245:8000/api/create-song', {
                lyrics,
            });
        
            const { taskId } = taskResponse.data;
            console.log('taskId:', taskId);
        
            const interval = setInterval(async () => {
                if (!shouldPollRef.current) {
                    clearInterval(interval);
                    return;
                }
        
                const statusResponse = await axios.get(
                    `http://192.168.1.245:8000/api/song/${taskId}`
                );
        
                const { audioUrl, message, imageUrl, lyrics: generatedLyrics } = statusResponse.data || {};
        
                if (audioUrl && imageUrl && audioUrl.trim() !== '' && imageUrl.trim() !== '') {
                    console.log('Song creation succeeded');
                    console.log(audioUrl, imageUrl, generatedLyrics);
                    setIsLoading(false);
    
                    setAudioUrl(audioUrl);
                    setImageUrl(imageUrl);
                    setLyrics(generatedLyrics);
    
                    console.log('audioUrl:', audioUrl);
                    console.log('imageUrl:', imageUrl);
                    console.log('lyrics:', generatedLyrics);
    
                    shouldPollRef.current = false; // Stop polling
                    router.push("/(auth)/(modal)/songPlayer");
                } else if (message && message !== 'The song is still being processed. Please check back later.') {
                    clearInterval(interval);
                    setIsLoading(false);
                    Alert.alert('Song creation failed. Please try again.');
                    shouldPollRef.current = false; // Stop polling
                } else {
                    console.log(message || 'Waiting for song creation to finish...');
                }
            }, 3000);
        } catch (error) {
            setIsLoading(false);
            console.error('Error generating song:', error);
            Alert.alert('Something went wrong. Please try again.');
            shouldPollRef.current = false; // Stop polling in case of an error
        }
    };

    const handleArrowButton = () => {
        router.back();
    }


  return (
    <SafeAreaView className='w-full h-full'>
        <ImageBackground
            source={require("../../../assets/images/home_background.png")}
            className='w-full h-full'
        >
            <View className='mt-16'>
                <TouchableOpacity onPress={handleArrowButton}>
                    <Ionicons className='ms-6' color="white" name="arrowleft" size={30}/>
                </TouchableOpacity>
            </View>

            <View className='w-full justify-center items-center mt-10'>
                <Image
                    source={{ uri: Array.isArray(song_art_image_url) ? song_art_image_url[0] : song_art_image_url }}
                    resizeMode='contain'
                    className='w-[345px] h-[330px]'
                />
            </View>

            <View className='mt-10 ms-10 flex-col gap-2'>
                <Text style={styles.songName} className='text-white text-xl'>
                    {full_title}
                </Text>
                <Text style={styles.songDetails} className='text-white text-sm'>
                    {artist_names}
                </Text>
            </View>

            <View className='mt-10 mx-4'>
                <CustomButton
                    title={isLoading ? "Generating..." : "Generate Song"}
                    colors={['rgb(5, 223, 233)', 'rgb(3, 125, 131)']}
                    onPress={handleGenerateSong}
                />
                {isLoading && <ActivityIndicator size="large" color="#fff" />}
            </View>

            <View className='mt-10 ms-3'>
                <Text style={styles.lyricsTitle} className='text-white text-xl pl-5'>Lyrics</Text>
            </View>

            <View className="w-full h-[300px] justify-center items-center">
                <View className="w-[381px] h-[300px] mt-5 justify-center items-center relative">
                    <ScrollView contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 5 }} className="w-full bg-white rounded-3xl">
                        <Text className="text-black text-xl text-center mt-2 z-10">{lyrics}</Text>
                        <View className="absolute inset-0 bg-black opacity-20 rounded-3xl" />
                    </ScrollView>
                </View>
            </View>
        </ImageBackground>
    </SafeAreaView>
  )
}

export default GenerateSong;

const styles = StyleSheet.create({
    songName: {
        fontFamily: "Poppins_400Regular"
    },
    songDetails: {
        fontFamily: "Poppins_500Medium"
    },
    lyricsTitle: {
        fontFamily: "Poppins_400Regular"
    }
})