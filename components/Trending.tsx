import React, { useRef, useState } from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { ResizeMode, Video } from "expo-av";
import * as Animatable from "react-native-animatable";

import { icons } from "../constants";


Animatable.initializeRegistryWithDefinitions({
  customZoomIn: {
    0: {
      scaleX: 0.8,
      scaleY: 0.8,
    },
    1: {
      scaleX: 1.0,
      scaleY: 1.0,
    },
  },
  customZoomOut: {
    0: {
      scaleX: 1,
      scaleY: 1,
    },
    1: {
      scaleX: 0.8,
      scaleY: 0.8,
    },
  },
})


interface TrendingItemProps {
    activeItem: string;
    item: any;
}

const TrendingItem = ({ activeItem, item }: TrendingItemProps) => {
  const [play, setPlay] = useState(false);

  const animationName = activeItem === item.$id ? 'customZoomIn' : 'customZoomOut';

  return (
    <Animatable.View
      className="mr-5"
      animation={animationName}
      duration={500}
    >
      {play ? (
        <Video
          source={{ uri: item.video }}
          className="w-52 h-72 rounded-[33px] mt-3 bg-white/10"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status:any) => {
            if (status.didJustFinish) {
              setPlay(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          className="relative flex justify-center items-center"
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
        >
          <ImageBackground
            source={{
              uri: item.thumbnail,
            }}
            className="w-52 h-72 rounded-[33px] my-5 overflow-hidden shadow-lg shadow-black/40"
            resizeMode="cover"
          />

          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};

const Trending = ({ posts }:any) => {
  const [activeItem, setActiveItem] = useState(posts[0]);

  const viewableItemsChanged = ({ viewableItems }:any) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key);
    }
  };

  return (
    <FlatList
      data={posts}
      horizontal
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <TrendingItem activeItem={activeItem} item={item} />
      )}
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70,
      }}
      //contentOffset={{ x: 170 }}
    />
  );
};

export default Trending;
