import { View, FlatList, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { FormField, CustomDropdown, CustomButtonGroup, CustomButton, ImageList, EmptyState } from '../../components'
import { CustomDDOption } from '../../components/CustomDropdown';
import pictureResJson from '../(tabs)/assets/pictureRes.json';
import stylesData from '../../lib/generator/stylesData.json';
import  { images }   from "../../constants";

import { getKey } from '../../lib/generator/keyFinderUtil';
import { formFinalPrompts, getImageId, fetchImage } from '@/lib/generator/fetchImageUtil';
import axios from 'axios';


const Create = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [isVisible, setVisible] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [form, setForm] = useState({
    positivePrompt: "",
    negativePrompt: "",
    artStyle: "",
    resolution:"",
  });

  const mapJsonToOptions = (json: any): CustomDDOption[] => {
    return json.map((item: any) => ({
      label: item.label,
      value: item.value,
      name: item.name, // Additional property if needed
      positive: item.positive, 
      negative: item.negative,
    }));
  };

  const handleSelection = (selectedValues: string | string[]) => {
    console.log('Selected:', selectedValues);
    setForm({ ...form, artStyle: selectedValues as string });
  };

  const handleButtonGroupSelection = (selectedValue: string) => {
    console.log('Selected Button:', selectedValue);
    setForm({ ...form, resolution: selectedValue as string });
  };

  const handleFetchImages = async (newImageId: string) => {
    try {
      const newImage = await fetchImage(newImageId);
      setImages(prevImages => [...prevImages, newImage]);
    } catch (error) {
      console.error('Error fetching new images:', error);
    }
  };

  const handleTyping = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const saveImage = async (imageUrl: string) => {
    try {
      const response = await axios.get(imageUrl, { responseType: 'blob' });
      const file = new File([response.data], 'image.jpg', { type: 'image/jpeg' });
      //const asset = await ImagePicker.saveToLibraryAsync(file);
      //console.log('Image saved to library:', asset);
    } catch (error) {
      console.error('Error saving image:', error);
    }
  }

  const submit = async () => {

    if (form.artStyle === "" || form.resolution === "") {
      Alert.alert("Error", "Please Choose art style and resolution");
    }

    setSubmitting(true);

    try {

      setImages([]);
      const userKey = await getKey();

      const {promptQuery, negativePromptQuery} = await formFinalPrompts(
        form.positivePrompt !== ""?form.positivePrompt:'RANDOM', 
        form.negativePrompt, form.artStyle);
      
      for (let idx = 1; idx <= 3; idx++) {
        const id = await getImageId(promptQuery, negativePromptQuery, userKey?.toString(), form.resolution);
        //console.log("id: "+id.imageId);
        //const imageUrl = await fetchImage(id.imageId);
        //console.log("imageUrl: "+imageUrl);
        handleFetchImages(id.imageId);
        //setParams(id.imageId);
      }
      
      //await imageGenerator(userKey,"newImage", 3 ,form.positivePrompt !== ""?form.positivePrompt:'RANDOM', 1, form.negativePrompt, form.artStyle, form.resolution,7);

      Alert.alert("Success", "Image created successfully");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    } 
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={images}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View className="flex-1">
            <Image source={{ uri: `data:image/jpeg;base64,${item}` }} className="w-[100%] h-[200px] mb-4"/>
            <CustomButton title="Save Image" handlePress={() => saveImage(item)} />
          </View>
        )}
        ListHeaderComponent={() => (
          <View className="flex px-4 justify-center mb-6 w-full">
            <CustomDropdown 
              label="Art Style"
              placeholder='Select your art style...'
              multiple={false}
              onSelect={handleSelection}
              jsonFilePath=''
              jsonData={stylesData}
              mapJsonToOptions={mapJsonToOptions}
              otherStyles="mt-10 size-large"
            />
            <FormField
              title="Appearance"
              value={form.positivePrompt}
              placeholder="Describe how your character look...."
              handleChangeText={(e) => setForm({ ...form, positivePrompt: e })}
              otherStyles="mt-10 size-large"
              multiline={true}
              numberOfLines={6}
            />
            <FormField
              title="Avoidance"
              value={form.negativePrompt}
              placeholder="Thing to avoid in the picture...."
              handleChangeText={(e) => setForm({ ...form, negativePrompt: e })}
              otherStyles="mt-10 size-large"
              multiline={true}
              numberOfLines={6}
            />
            <CustomButtonGroup 
              options={pictureResJson} 
              onSelect={handleButtonGroupSelection}  
              label="Picture Shape"
              otherStyles="mt-10 size-large w-full"/>

            <CustomButton
              title="Generate"
              handlePress={submit}
              containerStyles="mt-7 w-full"
              isLoading={isSubmitting}
            /> 
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="flex justify-center items-center bg-primary">

          </View>
        )}     
      />
    </SafeAreaView>
  )
}

export default Create
