import React, {  useState } from "react";
import { FlatList, Image, RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Models } from "react-native-appwrite";

import { images } from "../../constants";
import useAppwrite from "../../lib/useAppwrite";
import { getAllPhotoPosts, getLatestPhotoPosts, getAllPosts, getLatestPosts } from "../../lib/appwrite";
import { EmptyState, PhotoCard, SearchInput, Trending, VideoCard } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";
import TrendingPhoto from "@/components/TrendingPhoto";


const Home = () => {
  const { user } = useGlobalContext();
/*   const { data: posts, refetch } = useAppwrite({ fn: getAllPosts }); 
  const { data: latestPosts } = useAppwrite({ fn: getLatestPosts }); */
  const { data: posts, refetch } = useAppwrite({ fn: getAllPhotoPosts }); 
  const { data: latestPosts } = useAppwrite({ fn: getLatestPhotoPosts });

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item:Models.Document) => item.$id}
        renderItem={({ item }) => (  
          <PhotoCard
            document = {item}
            title={item.title}
            creator={item.creator.username}
            avatar={item.creator.avatar}
            photo={item.photo}
            artStyle={item.artStyle}
            description={item.description}
            positive={item.positive}
            negative={item.negative}
            likes={item.likes}
            handleRefresh={onRefresh}
          />
        )}
        ListHeaderComponent={() => (
          <View className="flex my-2 px-4 space-y-6">
            <View className="flex justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                  Welcome back, 
                </Text>
                <Text className="text-2xl font-psemibold text-white">
                  {user?.username}
                </Text>
              </View>

              <View className="mt-1.5">
                <Image
                  source={images.logoSmall}
                  className="w-9 h-10"
                  resizeMode="contain"
                />
              </View>
            </View>

            <SearchInput />

            <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-lg font-pregular text-gray-100 mb-3">
                Latest Photos
              </Text>

              <TrendingPhoto posts={latestPosts ?? []} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Photos Found"
            subtitle="No photos created yet"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  )
}

export default Home
