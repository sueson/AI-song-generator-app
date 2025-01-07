import { router, Slot } from "expo-router";
import { 
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
  Poppins_800ExtraBold,
  Poppins_600SemiBold
 } from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';
import "../global.css";
import { useEffect, useState } from "react";
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo'
import { LogBox, Text } from "react-native";
import { tokenCache } from "@/utils/cache";
import { useAuth } from "@clerk/clerk-expo";

import GlobalProvider from "@/context/global-provider";
import { StatusBar } from "expo-status-bar";



const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env',
  )
}

// used to ignore the clerk warning
LogBox.ignoreLogs(['Clerk: Clerk has been loaded with development keys']);


// Prevent autohide splash screen...
SplashScreen.preventAutoHideAsync();

const InitialLayout = () => {
  const [fontsloaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
    Poppins_800ExtraBold,
    Poppins_600SemiBold
  });

  const {isLoaded, isSignedIn } = useAuth();
  const [ready, setReady] = useState(false);
  
  useEffect(() => {
    if(fontsloaded && isLoaded) {
      setReady(true);
      SplashScreen.hideAsync();
    }
  },[fontsloaded, isLoaded]);

  useEffect(() => {
    if (ready) {
      if (isSignedIn) {
        router.replace("/(auth)/(tabs)/home");
      } else {
        router.replace("/(public)");
      }
    }
  },[ready, isSignedIn]);

  if(!ready) {
    return (
      <Text className="text-white">
        loading...
      </Text>
    )
  }
  return <Slot/>;
}


export default function RootLayout() {
  return (
    <GlobalProvider>
      <ClerkProvider 
        publishableKey={publishableKey!} 
        tokenCache={tokenCache}
      >
        <ClerkLoaded>
            {/* childrens */}
            <InitialLayout />
        </ClerkLoaded>
      </ClerkProvider>
      <StatusBar style="dark" />
    </GlobalProvider>
  )
}
