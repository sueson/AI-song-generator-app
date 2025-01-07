import { Stack } from 'expo-router';

const AuthLayout = () => {
  return (
        <Stack>
            <Stack.Screen name="sign-in" options={{ headerShown: false }} />
            <Stack.Screen name="sign-up" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(modal)/loading" options={{ presentation: "modal", headerShown: false }} />
            <Stack.Screen name="(modal)/songPlayer" options={{ presentation: "modal",  headerShown: false }} />
            <Stack.Screen name="(modal)/remixModalPage" options={{ presentation: "modal",  headerShown: false }} />
            <Stack.Screen name="(modal)/generateSong" options={{ presentation: "modal",  headerShown: false }} />
        </Stack> 
  )
}

export default AuthLayout;