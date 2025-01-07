import { useRouter } from "expo-router";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import CustomButton from "@/components/custom-button";
import { Image } from "react-native";

export default function Page() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.replace("/(auth)/sign-up")
  };
  return(
    <View className="bg-black">
      <StatusBar hidden />
      <ImageBackground
        source={require("../../assets/images/onboarding_image.png")}
        className="w-full h-full"
      >
        <View style={styles.onboardingContainer} className="flex w-full flex-1 flex-col justify-center items-center">
          <Image
            source={require("../../assets/images/onboarding_text_container.png")}
            className="w-full h-full absolute" 
          />
            <Text style={styles.onboardingTitle} className="text-white text-center text-4xl">Remix, Reimagine, </Text>
            <Text style={styles.onboardingTitle} className="text-white text-center text-4xl mb-4">Recreate</Text>

            <View className="w-full justify-center items-center mb-10">
              <Text style={styles.onboardingSubtitle} className="text-white text-xl">
                Unleash Your Creativity With the
              </Text>
              <Text style={styles.onboardingSubtitle} className="text-white text-xl">
                AI-powered music 
              </Text>
              <Text style={styles.onboardingSubtitle} className="text-white text-xl">
                remixer
              </Text>
            </View>

            <View>

          <CustomButton 
            title= "Get Started"
            onPress={handleGetStarted}
            colors={['rgb(5, 223, 233)', 'rgb(3, 125, 131)']}
          />
        </View>

        </View>

        
      </ImageBackground>
    </View>
  )
};


const styles = StyleSheet.create({
  onboardingContainer: {
    marginTop: 550,
  },
  onboardingTitle: {
    fontFamily: "Poppins_700Bold",
  },
  onboardingSubtitle: {
    fontFamily: "Poppins_500Medium",
  }
})