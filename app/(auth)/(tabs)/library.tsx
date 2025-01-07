import { View, Text, ImageBackground, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Library = () => {
  return (
    <SafeAreaView className="flex-1 bg-black">
      <ImageBackground
        source={require("../../../assets/images/home_background.png")}
        className="w-full h-full"
      >
        <View className="px-6 pt-10">
          <Text className="text-white text-3xl font-semibold">Liked Songs</Text>

          <ScrollView className="mt-6">
            <View className="bg-white p-4 rounded-lg mb-4">
              <Text className="text-white text-lg">Song Title 1</Text>
              <Text className="text-gray-400">Artist Name</Text>
            </View>
            <View className="bg-[#1E1E1E] p-4 rounded-lg mb-4">
              <Text className="text-white text-lg">Song Title 2</Text>
              <Text className="text-gray-400">Artist Name</Text>
            </View>
            <View className="bg-[#1E1E1E] p-4 rounded-lg mb-4">
              <Text className="text-white text-lg">Song Title 3</Text>
              <Text className="text-gray-400">Artist Name</Text>
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Library;
