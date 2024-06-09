import React, {  useEffect, useState } from "react";
import { FlatList, Image, RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Models } from "react-native-appwrite";
import * as Animatable from "react-native-animatable";
import { useLocalSearchParams } from "expo-router";

import useAppwrite from "../../lib/useAppwrite";
import {searchPhotoPosts } from "../../lib/appwrite";
import { EmptyState, PhotoCard, SearchInput, VideoCard } from "../../components";


const Search = () => {
  const { query } = useLocalSearchParams();
  const { data: posts, refetch } = useAppwrite( { fn: searchPhotoPosts }, query ); 


  useEffect(() => {
    refetch();
  }, [query]);

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
            handleRefresh={refetch}
          />
        )}
        ListHeaderComponent={() => (
          <View className=" my-6 px-4">
            <Text className="font-pextrabold text-2xl text-gray-100">
                Search Result 
              </Text>
              <Text className="text-2xl font-psemibold text-white">
                {query}
            </Text>
            <View className="mt-6 mb-8">
              <SearchInput initialQuery={query}/>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Photos Found"
            subtitle="No Photos found for this search query"
          />
        )}
      />
    </SafeAreaView>
  )
}

export default Search