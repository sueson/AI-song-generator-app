import { View, Text, ImageBackground, TextInput, ActivityIndicator, FlatList, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';

interface SongResult {
  id: string;
  full_title: string;
  artist_names: string;
  song_art_image_url: string;
  lyrics: string;
}

const RemixRoom = () => {
  const router = useRouter();

  const [query, setQuery] = useState<string>('');
  const [result, setResult] = useState<SongResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchSong = async (searchQuery: string) => {
    setLoading(true);

    try {
      const response = await axios.get(`http://10.250.3.35:7300/api/search-song?q=${searchQuery}`);

      const data = Array.isArray(response.data?.data) ? response.data.data : [];
      setResult(data);
    } catch (error) {
      console.log("Error fetching songs", error);
      setResult([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      if(query.trim()) {
        fetchSong(query);
      } else {
        setResult([]);
      }
    }, 300);

    return () => clearTimeout(timeOutId);
  }, [query]);

  useEffect(() => {
    router.push("/(auth)/(modal)/remixModalPage");
  }, []);

  return (
    <SafeAreaView>
      <ImageBackground
        source={require("../../../assets/images/home_background.png")}
        className='w-full h-full'
      >
        <View className='w-full mt-[100px] justify-center items-center'>
          <TextInput
            className='bg-[#D9D9D9] rounded-2xl w-[364px] h-[44px] ps-3' 
            value={query}
            onChangeText={setQuery}
            placeholder='Search by song name'
            placeholderTextColor="#8A9A9D"
          />
        </View>

        {
          loading ? (
            <ActivityIndicator size="large" color="#000" className='mt-10' />
          ) : (
            <FlatList
              data={result}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View>
                  <TouchableOpacity
                    className='p-4 border-b border-gray-100'
                    onPress={() => {
                      router.push({
                        pathname: "/(auth)/(modal)/generateSong", 
                        params: {
                          full_title: item.full_title,
                          artist_names: item.artist_names,
                          song_art_image_url: item.song_art_image_url,
                          lyrics: item.lyrics,
                        },
                      });
                    }}
                  >
                    <View className='flex-row gap-2 overflow-hidden'>
                    <Image
                      source={{ uri: item.song_art_image_url }}
                      className='w-[50px] h-[50px]'
                    />
                    <Text className='text-white text-xl'>
                      {item.full_title || "No title available"}
                    </Text>
                    <Text className='text-white text-xl'>
                      {item.artist_names || "No name available"}
                    </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
              contentContainerStyle={{ marginTop: 20, paddingBottom: 20 }}
            />
          )
        }
      </ImageBackground>
    </SafeAreaView>
  );
};

export default RemixRoom;
