import { useEffect, useState } from "react";
import { ResizeMode, Video } from "expo-av";
import * as Haptics from 'expo-haptics';
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import { Models } from "react-native-appwrite";

import { icons } from "../constants";
import { useGlobalContext } from "../context/GlobalProvider";
import { updateLike } from "../lib/appwrite";

interface PhotoCardProps {
    document:Models.Document;
    title: string;
    creator: string;
    avatar: string;
    photo: string;
    artStyle: string;
    description?: string;
    positive:string;
    negative:string;
    likes: Models.Document[];
    handleRefresh: () => void;
}

const PhotoCard = ({ document, title, creator, avatar, photo, artStyle, description, positive, negative , likes, handleRefresh}: PhotoCardProps) => {

  const { user } = useGlobalContext();
  const [isOverlayVisible, setOverlayVisible] = useState(false);

  const toggleBookmark = async() =>{

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if((likes.length > 0 && likes.filter(like => like.username === `${creator}`).length > 0)) {
      likes = likes.filter(like => like.username !== `${creator}`);
    }
    else if(user!==null && user!==undefined){
      likes.push(user);
    }

    await updateLike(document,likes).then().catch(error => Alert.alert("Error in Bookmark", error)).finally(() => handleRefresh());
  
  }

  const handlePress = () => {
    setOverlayVisible(!isOverlayVisible);
  };
  
    return (
      <View className="flex flex-col items-center px-4 mb-16">
        <View className="flex flex-row gap-3 items-start">
          <View className="flex justify-center items-center flex-row flex-1">
            <View className="w-[46px] h-[46px] rounded-lg border border-secondary flex justify-center items-center p-0.5">
              <Image
                source={{ uri: avatar }}
                className="w-full h-full rounded-lg"
                resizeMode="cover"
              />
            </View>
  
            <View className="flex justify-center flex-1 ml-3 gap-y-1">
              <Text
                className="font-psemibold text-sm text-white"
                numberOfLines={1}
              >
                {title} - [{artStyle}]
              </Text>
              <Text
                className="text-xs text-gray-100 font-pregular"
                numberOfLines={1}
              >
                {creator}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => toggleBookmark()}
            
          >
            <View className="pt-2">
              <Image source={(likes.length > 0 && likes.filter(like => like.username === creator ).length > 0 )  ? icons.bookmark_filled : icons.bookmark} 
                    className="w-5 h-5" resizeMode="contain" alt="bookmark "/>
            </View>
          </TouchableOpacity>

        </View>
  
          <TouchableOpacity
            activeOpacity={0.7}
            onPressIn={handlePress}
            onPressOut={handlePress}
            className="w-full h-60 rounded-xl mt-3 relative flex justify-center items-center"
          >
            <Image
              source={{ uri: photo }}
              className="w-full h-full rounded-xl mt-3"
              resizeMode="contain"
            />
            {isOverlayVisible && (
                <View className="opacity-60 flex justify-start items-start bg-black absolute w-[98%] h-[90%]">
                  <Text className="font-psemibold text-sm text-white">Art Style: {artStyle}</Text>
                  <Text className="font-psemibold text-sm text-white">Appearance: 
                  <Text className="font-pregular text-sm text-white"> {description}</Text></Text>
                  <Text className="font-psemibold text-sm text-white">Avoidance: 
                  <Text className="font-pregular text-sm text-white"> {negative}</Text></Text>
                  <Text className="font-psemibold text-sm text-white">Prompt: 
                  <Text className="font-pregular text-sm text-white"> {positive}</Text></Text>
                </View>
            )}
          </TouchableOpacity>
        
      </View>
    );
  };
  

export default PhotoCard