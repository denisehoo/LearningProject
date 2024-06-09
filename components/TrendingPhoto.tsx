import React, { useRef, useState } from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import * as Animatable from "react-native-animatable";


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

const TrendingPhotoItem = ({ activeItem, item }: TrendingItemProps) => {

  const animationName = activeItem === item.$id ? 'customZoomIn' : 'customZoomOut';

  return (
    <Animatable.View
      className="mr-5"
      animation={animationName}
      duration={500}
    >
        <Image
        source={{
            uri: item.photo,
        }}
        className="w-52 h-72 rounded-[33px] my-5 overflow-hidden shadow-lg shadow-black/40"
        resizeMode="cover"
        />
    </Animatable.View>
  );
};

const TrendingPhoto = ({ posts }:any) => {
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
        <TrendingPhotoItem activeItem={activeItem} item={item} />
      )}
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70,
      }}
    />
  );
};

export default TrendingPhoto;
