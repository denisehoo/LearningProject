import { View, Text, ScrollView, Keyboard, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Animatable from "react-native-animatable";
import * as Haptics from 'expo-haptics';

import { FormField, CustomDropdown, CustomButtonGroup, CustomButton } from '../../components'
import { CustomDDOption } from '../../components/CustomDropdown';
import ImageList  from '../../components/ImageList';
import pictureResJson from '../(tabs)/assets/pictureRes.json';
import stylesData from '../../lib/generator/stylesData.json';

import { getKey } from '../../lib/generator/keyFinderUtil';
import { formFinalPrompts, getImageId, fetchImage, writeFileIntoCache } from '@/lib/generator/fetchImageUtil';


const Create = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [form, setForm] = useState({
    positivePrompt: "",
    negativePrompt: "",
    artStyle: "",
    resolution:"",
    finalNegative: "",
    finalPostive: "",
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
    setForm({ ...form, artStyle: selectedValues as string });
  };

  const handleButtonGroupSelection = (selectedValue: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setForm({ ...form, resolution: selectedValue as string });
  };

  const submit = async () => {

    if (form.artStyle === "" || form.resolution === "") {
      Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Warning);
      Alert.alert("Error", "Please Choose art style and resolution");
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSubmitting(true);

    const userKey = await getKey();

    if(userKey === null){
      Alert.alert("Error", "No AI Key Found!");
      setSubmitting(false);
      return;
    }

    try {
      setImages([]);
      
      const {promptQuery, negativePromptQuery} = await formFinalPrompts(
        form.positivePrompt !== ""?form.positivePrompt:'RANDOM', 
        form.negativePrompt, form.artStyle);

      form.finalPostive = promptQuery;
      form.finalNegative = negativePromptQuery;
      
      for (let idx = 1; idx <= 3; idx++) {
        const id = await getImageId(promptQuery, negativePromptQuery, userKey?.toString(), form.resolution);
        const newBase64Image = await fetchImage(id.imageId);
        let localUri = await writeFileIntoCache(newBase64Image.content,  newBase64Image.extension, `newImage${idx}`);
        setImages(prevImages => [...prevImages, localUri]);
      }

      Alert.alert("Success", "Image created successfully");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {      
      setSubmitting(false);
    } 
  };


  return (
    <SafeAreaView className="bg-primary h-full">
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
      <ScrollView>
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
          otherStyles="mt-10 size-large"/>

        <CustomButton
          title="Generate"
          handlePress={submit}
          containerStyles="mt-7"
          isLoading={isSubmitting}
        /> 
        {(images.length >= 3 )? 
        <ImageList images={images} artStyle={form.artStyle} 
          description = {form.positivePrompt} positivePrompt = {form.finalPostive} negativePrompt = {form.finalNegative}/> :
          ( isSubmitting ? <View className="items-center mt-8"><Animatable.Text animation="tada" easing="ease-out" iterationCount="infinite" className="text-white font-psemibold 
                      text-lg">Generating image {images.length+1} ....</Animatable.Text></View> : <View className="items-center">
                      <Animatable.Text animation="pulse" iterationCount="infinite" easing="ease-out" className="text-white font-psemibold text-lg mt-4">Click Generate to get 3 images</Animatable.Text></View>)}
      </ScrollView>      
    </SafeAreaView>
  )
}

export default Create

