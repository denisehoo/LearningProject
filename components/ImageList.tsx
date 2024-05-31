import React, { useState, useEffect } from 'react';
import { View, FlatList, Image, Text, StyleSheet } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';

import CustomButton from './CustomButton';
import { writeFileIntoFS, saveToDevice } from '../lib/generator/fetchImageUtil';


const ImageList = ({ images }: { images: string[] }) => {
  const saveImage = async (base64Image: string) => {
    try {
      const fileUri = await writeFileIntoFS(base64Image, 'new1.jpeg');
      //saveToDevice(fileUri);
    } catch (error) {
      console.error('Error saving image:', error);
    }
  };

  return (
    <View className="flex-1 px-2 py-2 mt-16">
      <View className="justify-center ml-2 mb-4">
        <Text className="font-psemibold text-2xl text-white">AI Image Result</Text>
      </View>
      <FlatList
        scrollEnabled={false} 
        data={images}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View className="mb-16">
            <Image source={{ uri: `data:image/jpeg;base64,${item}` }} className="w-[100%] h-[600px] relative mb-4"/>
            <CustomButton title="Save Image" handlePress={() => saveImage(item)} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  imageContainer: {
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 8,
  },
});

export default ImageList;

