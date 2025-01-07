import { View, Text, ImageBackground, StyleSheet, Image, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather'
import { useOAuth } from "@clerk/clerk-expo";
import CustomButton from '@/components/custom-button';
import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { useSignIn, useClerk } from '@clerk/clerk-expo';

const SignIn = () => {
  const { signIn } = useSignIn();
  const { setActive } = useClerk();
  const router = useRouter();

  const { startOAuthFlow : startGoogleOAuthFlow } = useOAuth({ strategy : 'oauth_google' });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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

  const handleEmailLogin = async () => {
    if(!signIn) {
      console.error("SignIn resource is not available");
      return;
    }

    if (!email || !password) {
      Alert.alert("Please fill out both fields.");
      return;
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: email,
        password: password
      });

      if(signInAttempt.status === "complete"){
        await setActive({ session: signInAttempt.createdSessionId })
        router.push("/(auth)/(tabs)/home");
      }
    } catch (error) {
      Alert.alert("Invalid credentials try again")
      console.log("Error signing in", error)
    }
  }

  return (
    <View>
      <ImageBackground
        source={require("../../assets/images/auth_background.png")}
        className="w-full h-full"
      >
        <ScrollView>
          <View style={styles.signUpContainer} className="w-full h-full flex flex-1 flex-col justify-center items-center">
            <View className="justify-center items-center mb-10">
              <Text style={styles.signUpText} className="text-white text-center text-4xl">
                Login to your account
              </Text>
            </View>

            <View className='w-10/12 flex gap-4 justify-center mb-8'>
            <Text style={styles.inputTitle} className='text-white text-lg'>Email</Text>
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
            <Text style={styles.inputTitle} className='text-white text-lg'>Password</Text>
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

            <View className='mx-4'>
                <CustomButton
                  title='Log in'
                  colors={['rgb(5, 223, 233)', 'rgb(3, 125, 131)']}
                  onPress={handleEmailLogin}
                />
              </View>

              <View className='flex w-10/12 flex-row justify-center items-center mt-10 mb-10'>
                <View style={styles.line} />
                <Text style={styles.text}>Or Continue with</Text>
                <View style={styles.line} />
              </View>

              <View className='w-10/12'>
                <View className='flex flex-row w-full justify-center items-center gap-10'>
                <TouchableOpacity onPress={handleGoogleLogin}>
                    <View className='bg-[#1E1E1E] p-3 rounded-full'>
                      <Image 
                        source={require("../../assets/images/google_icon.png")}
                        resizeMode='contain'
                        className='w-12 h-12'
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>


              <View className='flex flex-row justify-center items-center mt-10'>
                <Text style={styles.bottomText} className='text-white text-lg'>
                  Don't have an account?{" "}
                <Link href="/(auth)/sign-up">
                  <Text className='text-[#7CEEFF]'>
                    Sign up
                  </Text>
                </Link>
                </Text>
              </View>

          </View>
        </ScrollView>
      </ImageBackground>
      <StatusBar hidden />
    </View>
  );
}

export default SignIn;

const styles = StyleSheet.create({
  signUpContainer: {
    marginTop: 200
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
  },
  inputTitle: {
    fontFamily: "Poppins_700Bold"
  }
})