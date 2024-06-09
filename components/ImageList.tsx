import React, { useState } from 'react';
import { View, FlatList, Image, Text, Alert } from 'react-native';

import { CustomButton, CustomPopup } from "../components";
import { saveToDevice, getFileSize } from '../lib/generator/fetchImageUtil';
import { useGlobalContext } from "../context/GlobalProvider";
import { createImagePost } from "../lib/appwrite";
import { router } from 'expo-router';


interface ImageListProps {
  images: string[];
  artStyle: string;
  description: string;
  positivePrompt: string;
  negativePrompt: string;
}

const ImageList = ({ images, artStyle, description, positivePrompt, negativePrompt }: ImageListProps) => {

  const { user } = useGlobalContext();
  const [isUpload, setIsUpload] = useState(false);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [submittedValue, setSubmittedValue] = useState("");


  const handleOpenPopup = (localUri: string, upload:boolean) => {
    setSubmittedValue("");
    setSelectedItem(localUri);
    setIsUpload(upload);
    setPopupVisible(true);
  };

  const handleClosePopup = () => {
    setPopupVisible(false);
  };

  const handleSubmit = async (value: string) => {
    setSubmittedValue(value.toString().trim());
    
    if(isUpload){
      pickImage(value.toString().trim());
    }
    else{
      saveToDevice(selectedItem, value.toString().trim(), "Cubator");
    }
    setSelectedItem("");
  };

  const pickImage = async (filename:string) => {
    try {
      let size = await getFileSize(selectedItem);
      await createImagePost(
        artStyle,
        description,
        positivePrompt,
        negativePrompt,
        filename,
        size,
        selectedItem,
        user?.$id,
      );
  
      Alert.alert("Success", "Post uploaded successfully");
      router.push("/profile");
    } catch (error:any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsUpload(false);
      setSubmittedValue("");
      setSelectedItem("");
    }
  };


  return (
    <View className="flex-1 px-2 py-2 mt-12">
      <View className="justify-center ml-2 mb-4">
        <Text className="font-psemibold text-2xl text-white">AI Image Result</Text>
      </View>
      <FlatList
        scrollEnabled={false} 
        data={images}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View className="py-6 mt-4">
            <Image source={{ uri: item }}  
                    className="w-96 h-96 items-center self-center"
                    style={{resizeMode: 'contain'}}
            />{submittedValue ? <Text>Submitted Value: {submittedValue}</Text> : null}
            <View className="flex-1 flex-row self-center my-2">
              <CustomButton title="Export Image" handlePress={ () => handleOpenPopup(item, false) } containerStyles="px-4 mx-4"/>
              <CustomButton title="Share Image" handlePress={ () => handleOpenPopup(item, true) } containerStyles="px-4 mx-4"/>
                <CustomPopup
                  visible={isPopupVisible}
                  onClose={handleClosePopup}
                  onSubmit={handleSubmit}
                />
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default ImageList;

