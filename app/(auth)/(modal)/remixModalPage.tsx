import { View, Text, ImageBackground, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '@/components/custom-button'
import { useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

const RemixModalPage = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    router.back();
  };

  return (
    <SafeAreaView className='bg-[#121111]'>
      <ImageBackground
        source={require("../../../assets/images/remix_room_bg.png")}
        className='w-full h-full'
      >
        <View className='flex-1 justify-center items-center mt-[500px]'>
          <Text style={styles.title} className='text-white text-center text-[24px]'>Make Your Own</Text>
          <Text style={styles.subTitle} className='text-[#05D7E0] text-center text-[36px]'>REMIX{" "} 
            <Text style={styles.subTitle} className='text-white] text-center'>SONG!</Text>
          </Text>

          <View className='mt-10'>
            <CustomButton
              title='Get Started'
              colors={['rgb(5, 223, 233)', 'rgb(3, 125, 131)']}
              onPress={handleGetStarted}
            />
        </View>
        </View>
      </ImageBackground>
      <StatusBar hidden />
    </SafeAreaView>
  )
}

export default RemixModalPage

const styles = StyleSheet.create({
  title: {
    fontFamily: "Poppins_400Regular"
  },
  subTitle:{
    fontFamily: "Poppins_600SemiBold"
  }
})