import Ionicons  from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { View } from 'react-native';


const TabLayout = () => {
  return (
    <View className='flex-1 bg-black'>
      <Tabs
      initialRouteName='home'
      screenOptions={{
        tabBarActiveTintColor: "#00C2CB",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          borderRadius: 50,
          elevation:0,
          height: 62,
          marginHorizontal: 20,
          paddingTop: 10,
          borderTopWidth: 0,
          marginBottom: 30,
          backgroundColor: "transparent",
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: 'bold',
          marginTop: 7
        },
      }}
    >
      <Tabs.Screen 
        name='home'
        options={{
          headerShown: false,
          title:"Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              color={color}
              size={30}
            />
          )
        }} 
      />

      <Tabs.Screen 
        name='remix-room'
        options={{
          headerShown: false,
          title:"Remix Room",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "musical-note" : "musical-note-outline"}
              color={color}
              size={30}
            />
          )
        }} 
      />

      <Tabs.Screen 
        name='library'
        options={{
          headerShown: false,
          title:"Library",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "folder-open" : 'folder-open-outline'}
              color={color}
              size={30}
            />
          )
        }} 
      />
    </Tabs>
    </View>
  )
}

export default TabLayout;