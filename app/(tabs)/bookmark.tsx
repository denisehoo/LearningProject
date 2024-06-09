import React, {  useCallback, useEffect, useState } from "react";
import { FlatList, Image, TouchableOpacity, TextInput, Text, View, Alert, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Models } from "react-native-appwrite";
import * as Animatable from "react-native-animatable";
import { useLocalSearchParams } from "expo-router";
import * as Haptics from 'expo-haptics';

import useAppwrite from "../../lib/useAppwrite";
import { searchBookmarkPhotoPosts } from "../../lib/appwrite";
import { EmptyState, PhotoCard, SearchInput, VideoCard } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";
import { icons } from "../../constants";


const Bookmark = () => {
  const { user } = useGlobalContext();
  const { data: posts, refetch } = useAppwrite( { fn: searchBookmarkPhotoPosts }, user?.username ); 

  
  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={ posts }
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
                Saved 
              </Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Photos Found"
            subtitle="No Photos found for this bookmark"
          />
        )}
      />
    </SafeAreaView>
  )
}

export default Bookmark