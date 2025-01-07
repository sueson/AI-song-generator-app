import { View, Text, ImageBackground, ScrollView, Image, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '@/components/custom-button';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useGlobalContext } from '@/context/global-provider';
import { useUser, useClerk } from '@clerk/clerk-expo';

const Home = () => {
    const { user } = useUser();
    const { signOut } = useClerk();

    const router = useRouter();
    const { setAudioUrl, setImageUrl, audioUrl, imageUrl, setLyrics} = useGlobalContext();

    const [story, setStory] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const shouldPollRef = useRef(false);

    const genres = ['Pop', 'Rap', 'Blues', 'Afro', 'Jazz', 'Funk'];

    const handleSignOut = () => {
        Alert.alert(
            "Sign Out",
            "Are you sure want to sign out?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Sign Out",
                    onPress: () => signOut()
                }
            ]
        )
    }

    const handleGenreSelection = (genre: string) => {
        setSelectedGenre(genre);
    }

    const handleCreateSong = async () => {
        if (!story || !selectedGenre) {
            Alert.alert('Please provide a story and select a genre.');
            return;
        }
    
        try {
            setIsLoading(true);
            shouldPollRef.current = true; // Start polling...
    
            const taskResponse = await axios.post('http://192.168.1.245:8000/api/create-song', {
                story,
                genre: selectedGenre,
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
    
                const { audioUrl, message, imageUrl, lyrics } = statusResponse.data || {};
    
                if (audioUrl && imageUrl && audioUrl.trim() !== '' && imageUrl.trim() !== '') {
                    console.log('Song creation succeeded');
                    console.log(audioUrl, imageUrl, lyrics);
                    setIsLoading(false);

                    setAudioUrl(audioUrl);
                    setImageUrl(imageUrl);
                    setLyrics(lyrics);

                    console.log('audioUrl:', audioUrl);
                    console.log('imageUrl:', imageUrl);
                    console.log('lyrics:', lyrics);

                    shouldPollRef.current = false; // Stop polling...
                } else if (message && message !== 'The song is still being processed. Please check back later.') {
                    clearInterval(interval);
                    setIsLoading(false);
                    Alert.alert('Song creation failed. Please try again.');
                    shouldPollRef.current = false; // Stop polling...
                } else {
                    console.log(message || 'Waiting for song creation to finish...');
                }
            }, 3000);
        } catch (error) {
            setIsLoading(false);
            console.error('Error creating song:', error);
            Alert.alert('Something went wrong. Please try again.');
            shouldPollRef.current = false; // Stops the polling in case of an error...
        }
    };
      

    useEffect(() => {
        if (isLoading) {
            router.replace("/(auth)/(modal)/loading");
        }
    }, [isLoading]);
    

    const handlePlay = () => {
        console.log('audioUrl in handlePlay:', audioUrl);
        console.log('imageUrl in handlePlay:', imageUrl);
        if (audioUrl && imageUrl) {
            router.push(`/songPlayer?songUrl=${encodeURIComponent(audioUrl)}&imageUrl=${encodeURIComponent(imageUrl)}`);
            console.log("Playing song:", audioUrl);
        } else {
            Alert.alert('No song available to play yet.');
        }
    };

  return (
    <SafeAreaView>
        <ImageBackground
            source={require("../../../assets/images/home_background.png")}
            className='w-full h-full'
        >
            <ScrollView className='mx-4'>
                <View className='flex flex-row items-center mt-10'>
                    <View className='flex-row rounded-full w-[160px] gap-5 h-full justify-center items-center ml-5'>
                        <TouchableOpacity className='w-10 h-10' onPress={handleSignOut}>

                            { user?.imageUrl ? (
                                <Image
                                    source={{ uri: user?.imageUrl }} 
                                    className='w-10 h-10'
                                    resizeMode='contain'
                                />
                            ): 
                            <Image
                                source={require("../../../assets/images/avatar.png")}
                                className='w-10 h-10'
                                resizeMode='contain' 
                                />
                            }
                            
                        </TouchableOpacity>

                        <Text style={styles.welcomeName} className='text-white text-2xl mt-3'>Welcome { user?.firstName }.</Text>
                    </View>

                    
                </View>

                <View className='w-full h-[200px] flex flex-row justify-center items-center relative'>
                    <Image
                        source={require("../../../assets/images/home_song_component.png")}
                        resizeMode='contain'
                        className='w-full h-full' 
                    />

                    <Text style={styles.songPlay} className='text-white text-[20px] absolute top-[40%] left-0 ms-5'>
                        {audioUrl ? 'Your Song is' : isLoading ? 'Creating your song...' : 'Start creating your song'}
                    </Text>
                    <Text style={styles.songPlay} className='text-white text-[24px] absolute top-[52%] left-0 ms-5'>
                        {audioUrl ? 'ready to play' : isLoading ? 'Please wait' : ''}
                    </Text>

                    <TouchableOpacity 
                        className='absolute right-0 w-[50px] h-[50px] mr-5' 
                        onPress={handlePlay}
                    >
                        <Image
                            source={require("../../../assets/images/home_play.png")}
                            resizeMode='contain'
                            className='w-[48px] h-[48px]'
                        />
                    </TouchableOpacity>
                </View>

                {/* Prompt Input */}
                <View className='w-full h-[212px] bg-white rounded-3xl'>
                    <View className='flex justify-center'>
                        <Text style={styles.DescriptionTitle} className='text-black mt-16 ms-5 text-xl'>
                            Song Description
                        </Text>
                        <View className='mt-5'>
                            <TextInput
                                style={styles.DescriptionSubtitle}
                                className='text-black ms-5 text-md'
                                placeholder='Enter here e.g. Create a lyrics based on friendship...' 
                                value={story}
                                onChangeText={setStory}
                            />
                        </View>
                    </View>
                </View>

                {/* Genre Selection */}
                <View className='mt-10'>
                    <Text className='text-white'>Select Genre</Text>

                    <View className='flex flex-row gap-8 flex-wrap mt-5'>
                        {genres.map((genre) => (
                            <View
                                key={genre}
                                className={`w-[112px] h-[58px] border border-white rounded-3xl ${selectedGenre === genre ? 'bg-teal-500' : 'bg-black/10'}`}
                            >
                                <CustomButton
                                    title={genre}
                                    colors={"black"}
                                    onPress={() => handleGenreSelection(genre)}
                                />
                            </View>
                        ))}
                        
                    </View>

                    <View className='mt-10 mb-10'>
                        <CustomButton
                            title="Create"
                            colors={['rgb(5, 223, 233)', 'rgb(3, 125, 131)']}
                            // onPress={() => router.replace("/(auth)/(modal)/loading")}
                            onPress={handleCreateSong}
                        />
                    </View>
                </View>
            </ScrollView>
        </ImageBackground>
    </SafeAreaView>
  )
}

export default Home;

const styles = StyleSheet.create({
    songPlay: {
        fontFamily: "Poppins_500Medium"
    },
    DescriptionTitle: {
        fontFamily: "Poppins_500Medium"
    },
    DescriptionSubtitle: {
        fontFamily: "Poppins_400Regular"
    },
    welcomeName: {
        fontFamily: "Poppins_500Medium"
    }
})