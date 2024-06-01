import { useState } from "react";
import { ResizeMode, Video } from "expo-av";
import { View, Text, TouchableOpacity, Image } from "react-native";

import { icons } from "../constants";

interface PhotoCardProps {
    title: string;
    creator: string;
    avatar: string;
    thumbnail: string;
    prompt: string;
}

const PhotoCard = ({ title, creator, avatar, thumbnail, prompt }: PhotoCardProps) => {
  const [isOverlayVisible, setOverlayVisible] = useState(false);

  const handlePress = () => {
    setOverlayVisible(!isOverlayVisible);
  };
  
    return (
      <View className="flex flex-col items-center px-4 mb-14">
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
                {title}
              </Text>
              <Text
                className="text-xs text-gray-100 font-pregular"
                numberOfLines={1}
              >
                {creator}
              </Text>
            </View>
          </View>
  
          <View className="pt-2">
            <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
          </View>
        </View>
  
          <TouchableOpacity
            activeOpacity={0.7}
            onPressIn={handlePress}
            onPressOut={handlePress}
            className="w-full h-60 rounded-xl mt-3 relative flex justify-center items-center"
          >
            <Image
              source={{ uri: thumbnail }}
              className="w-full h-full rounded-xl mt-3"
              resizeMode="contain"
            />
            {isOverlayVisible && (
                <View className="opacity-60 flex justify-start items-start bg-black absolute top-32 w-[85%] h-[50%]">
                  <Text className="font-psemibold text-sm text-white">Prompt: </Text>
                  <Text className="font-pregular text-sm text-white"> {prompt}</Text>
                </View>
            )}
          </TouchableOpacity>
        
      </View>
    );
  };
  

export default PhotoCard