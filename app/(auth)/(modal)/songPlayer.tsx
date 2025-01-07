import { View, Text, ImageBackground, Image, TouchableOpacity, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useRouter } from 'expo-router';
import { useGlobalContext } from '@/context/global-provider';

const SongPlayer = () => {
    const router = useRouter();

    const {  
        imageUrl, 
        lyrics,
        isPlaying,
        togglePlayPause,
        duration,
        position,
        handleSeek
        } = useGlobalContext();
    
    const handleArrowButton = () => {
        router.push("/(auth)/(tabs)/home");
    };

    const formatTime = (milliseconds: number) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const remainingSeconds = Math.floor(totalSeconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

  return (
    <SafeAreaView>
        <ImageBackground
            source={require("../../../assets/images/home_background.png")}
            className='w-full h-full'
        >
            <View className='mt-16'>
                <TouchableOpacity onPress={handleArrowButton}>
                    <Ionicons className='ms-6' color="white" name="chevron-down" size={30}/>
                </TouchableOpacity>
            </View>
            
            {/* Song Image */}
            <View className='w-full justify-center items-center mt-10'>
                <Image
                    source={imageUrl ? { uri: imageUrl } : require("../../../assets/images/music_player_image.png")}
                    resizeMode='contain'
                    className='w-[345px] h-[330px]' 
                />
            </View>

            {/* Song Name */}
            <View className='w-full justify-start mt-10'>
                <View className='ms-10'>
                    <Text className='text-white text-2xl'>Song name</Text>
                </View>
            </View>

        {/* Slider Section */}
        <View className="w-full px-10 mt-8">
          <Slider
            className='w-full h-[40px]'
            minimumValue={0}
            maximumValue={1}
            value={duration > 0 ? position / duration : 0}
            onSlidingComplete={handleSeek}
            minimumTrackTintColor="#7CEEFF"
            maximumTrackTintColor="#d3d3d3"
            thumbTintColor="#7CEEFF"
          />
          <View className="flex-row justify-between mt-2">
            <Text className="text-white text-md">{formatTime(position)}</Text>
            <Text className="text-white text-md">{formatTime(duration)}</Text>
          </View>
        </View>

        {/* Play/Pause Button */}
        <View className='w-full justify-center items-center mt-5'>
            <TouchableOpacity onPress={togglePlayPause} className='w-[56px] h-[56px]'>
                <Image
                    source={isPlaying ? require("../../../assets/images/pause_button.png") : require("../../../assets/images/play_button.png")}
                    resizeMode='contain'
                    className='w-[56px] h-[56px]' 
                />
            </TouchableOpacity>
        </View>

        {/* lyrics section */}
        <View className='mt-4 ms-3'>
            <Text className='text-white text-xl pl-5'>Lyrics</Text>
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
};

export default SongPlayer;