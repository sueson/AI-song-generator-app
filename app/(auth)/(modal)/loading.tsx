import CustomButton from '@/components/custom-button';
import { router } from 'expo-router';
import { View, Text, ImageBackground, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Loading = () => {
  const handleHide = () => {
    router.replace("/(auth)/(tabs)/home");
  }

  return (
    <SafeAreaView>
      <ImageBackground
        source={require("../../../assets/images/home_background.png")}
        className='w-full h-full'
      >
        <View className='flex flex-row justify-end items-center mt-20'>
          <View className='w-[112px] h-59px] text-center'>
            <CustomButton
              title="Hide"
              colors={['rgb(5, 223, 233)', 'rgb(3, 125, 131)']} 
              onPress={handleHide}
            />
          </View>
        </View>

        <View className='w-full justify-center items-center mt-40'>
          <Image
            source={require("../../../assets/images/loading_image.png")} 
            resizeMode='contain'
            className='w-[169px] h-[169px]'
          />
        </View>

        <View className='w-full justify-center items-center mt-20'>
          <Text style={styles.loadingTitleText} className='text-white text-center text-3xl w-full'>
            Working on Your Cover
          </Text>

          <Text style={styles.loadingSubtitleText} className='text-white mt-10 text-xl text-center'>
            You'll Get Notified Once Your {"\n"}
            <Text className='text-center'>Music is ready</Text>
          </Text>
        </View>
        
      </ImageBackground>
    </SafeAreaView>
  )
}

export default Loading;

const styles = StyleSheet.create({
  loadingTitleText: {
    fontFamily: "Poppins_600SemiBold"
  },
  loadingSubtitleText: {
    fontFamily: "Poppins_400Regular"
  }
})