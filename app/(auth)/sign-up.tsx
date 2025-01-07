import { View, Text, ImageBackground, StyleSheet, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Entypo, Feather, Ionicons } from '@expo/vector-icons';
import { useClerk, useOAuth, useSignUp } from "@clerk/clerk-expo";
import CustomButton from '@/components/custom-button';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isLoaded, signUp } = useSignUp();
  const { setActive } = useClerk();

  const { startOAuthFlow : startGoogleOAuthFlow } = useOAuth({ strategy : 'oauth_google' });

  const handleGoogleLogin = async () => {
    try {
      const { createdSessionId, setActive } =  await startGoogleOAuthFlow();
      console.log('~ handleGoogleLogin ~ createdSessionId: ', createdSessionId);

      if(createdSessionId) {
        setActive!({ session: createdSessionId });
      }

    } catch (error) {
      console.log(error);
    }
  };

  const handleEmailSignUp = async () => {
    if (!isLoaded) return;

    try {
      const signUpResponse = await signUp.create({
        emailAddress: email,
        password: password,
      });

      const { createdSessionId } = signUpResponse;

      if (createdSessionId) {
        setActive({ session: createdSessionId });
        Alert.alert("Sign-up successful!");
      }
    } catch (error) {
      console.error("Sign-Up Error:", error);
      Alert.alert("Failed to sign up. Please try again.");
    }
  };

  return (
    <View>
      <ImageBackground
        source={require("../../assets/images/auth_background.png")}
        className="w-full h-full"
      >
        <View style={styles.signUpContainer} className="w-full h-full flex flex-1 flex-col justify-center items-center">
          <View className="justify-center items-center mb-10">
            <Text style={styles.signUpText} className="text-white text-center text-4xl">
              Let's Get You In
            </Text>
          </View>

          <View className='w-10/12 flex gap-4 justify-center mb-8'>
            <Text className='text-white text-lg'>Email</Text>
              <View className='bg-[#1E1E1E] flex-row gap-3 p-4 py-6 w-full rounded-xl'>
                <Entypo name='email' color="gray" size={24} />
                <TextInput 
                  className='text-white text-xl'
                  placeholder='Enter your email here'
                  placeholderTextColor="gray"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            <View className='w-10/12 flex-col gap-4 mb-10'>
            <Text className='text-white text-lg'>Password</Text>
              <View className='bg-[#1E1E1E] flex-row gap-3 p-4 py-6 w-full rounded-xl'>
                <Feather name='lock' color="gray" size={24} />
                <TextInput
                  className='text-white text-xl'
                  placeholder='Enter your password here'
                  placeholderTextColor="gray"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
            </View>

            <CustomButton
              title='Sign up'
              colors={['rgb(5, 223, 233)', 'rgb(3, 125, 131)']}
              onPress={handleEmailSignUp}
            />

            <View className='flex w-10/12 flex-row justify-center items-center mt-3 mb-10'>
              <View style={styles.line} />
              <Text style={styles.text}>Or</Text>
              <View style={styles.line} />
            </View>


            <TouchableOpacity className='flex flex-row justify-center items-center mb-7' onPress={handleGoogleLogin}>
              <View style={styles.logoContainer} className='flex flex-row gap-14 justify-center items-center'>
                <Image
                  source={require("../../assets/images/google_icon.png")} 
                  resizeMode='contain'
                  className='w-10 h-10'
                />
                <Text className='text-white text-lg'>
                  Continue with Google
                </Text>
                <Ionicons color="white" name="chevron-forward" size={24}/>
              </View>
            </TouchableOpacity>


            <View className='flex flex-row justify-center items-center mt-10'>
              <Text style={styles.bottomText} className='text-white text-lg'>
                Have an account?{" "}
              <Link href="/(auth)/sign-in">
                <Text className='text-[#7CEEFF]'>
                  Sign In
                </Text>
              </Link>
              </Text>
            </View>

        </View>
      </ImageBackground>
      <StatusBar hidden />
    </View>
  );
}

export default SignUp;

const styles = StyleSheet.create({
  signUpContainer: {
    marginTop: 100
  },
  signUpText: {
    fontFamily: "Poppins_400Regular"
  },
  logoContainer: {
    width: 377,
    height: 60,
    borderRadius: 10,
    backgroundColor: "#1E1E1E"
  },
  line: {
    flex: 1,
    height: 0.5,
    backgroundColor: 'white',
  },
  text: {
    color: 'white',
    marginVertical: 10,
    fontSize: 16,
    fontFamily: "Poppins_400Regular"
  },
  bottomText: {
    fontFamily: "Poppins_400Regular"
  }
})