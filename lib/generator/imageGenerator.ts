import React, { useState } from 'react';
import { View, Button, Text, StyleSheet, Alert, ActivityIndicator, FlatList, Image } from 'react-native';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { encode, replaceRandomWords } from './utils';
import  { getStyleByName, StyleDataProp }  from './styles';
import MySentencelist from './wordlist';
import { getKey } from './keyFinderUtil';


export async function imageGenerator(
    userKey = '',
    baseFilename = '',
    amount = 1,
    prompt = 'RANDOM',
    promptSize = 1,
    negativePrompt = '',
    style = 'RANDOM',
    resolution = '512x768',
    guidanceScale = 7
  ) {
    const createUrl = 'https://image-generation.perchance.org/api/generate';
    const downloadUrl = 'https://image-generation.perchance.org/api/downloadTemporaryImage';

    let promptBase: string;
    if (prompt === 'RANDOM') {
      const sentencelist = new MySentencelist();
      const samplePrompt = sentencelist.getPrompt(promptSize);
      promptBase = replaceRandomWords(samplePrompt);
    } else {
      promptBase = prompt;
    }


    let styleChoice: StyleDataProp;
 
    styleChoice = getStyleByName(style);
    
    const promptStyle = styleChoice.positive;
    const negativePromptStyle = styleChoice.negative;

    const promptQuery = encode('\'' + promptBase + ', ' + promptStyle);
    const negativePromptQuery = encode('\'' + negativePrompt + ', ' + negativePromptStyle);

    console.log("promptQuery: "+promptQuery);
    console.log("negativePromptQuery: "+negativePromptQuery);

    const generatedImages: Array<{ filename: string; prompt: string; negative_prompt: string }> = [];

    for (let idx = 1; idx <= amount; idx++) {
      const requestId = Math.random();
      const cacheBust = Math.random();

      const createParams = {
        prompt: promptQuery,
        negativePrompt: negativePromptQuery,
        userKey: userKey,
        __cache_bust: cacheBust,
        seed: '-1',
        resolution: resolution,
        guidanceScale: guidanceScale.toString(),
        channel: 'ai-text-to-image-generator',
        subChannel: 'public',
        requestId: requestId
      };

      const createResponse = await axios.get(createUrl, { params: createParams });
      if (createResponse.data.status ==='not_verified') {
        throw new Error('Image could not be generated (invalid key).');
      }
      console.log("got create response"+createResponse.data.imageId);

      let imageId: string | null = null;
      while (!imageId) {
        try {
          imageId = createResponse.data.imageId;
        } catch {
          await new Promise(resolve => setTimeout(resolve, 8000));
        }
      }
      console.log("try downloading image...");
      const downloadParams = { imageId: imageId };
      const downloadResponse = await axios.get(downloadUrl, { params: downloadParams, responseType: 'blob' });
      console.log("downloadResponse: "+ downloadResponse.headers['Content-Type']?.toString());
      
      const generatedDir = FileSystem.documentDirectory + 'generated-pictures';
      //console.log("generatedDir: "+ generatedDir);

      const dirInfo = await FileSystem.getInfoAsync(generatedDir);
      if (!dirInfo.exists) {
        try{
          await FileSystem.makeDirectoryAsync(generatedDir,);
        }catch(err){
          console.error("Directory cannot be created: "+err);
        }
        console.log("Directory created: "+ generatedDir);
      }

      const filename = baseFilename ? `${generatedDir}/${baseFilename}${idx}.jpeg` : `${generatedDir}/${imageId}.jpeg`;
      //console.log("filename: "+ filename);

      //await FileSystem.writeAsStringAsync(filename, downloadResponse.data, { encoding: FileSystem.EncodingType.Base64 });

      //generatedImages.push({ filename: filename, prompt: promptBase, negative_prompt: negativePrompt });

      // let base64_image = await FileSystem.readAsStringAsync(filename, { encoding: FileSystem.EncodingType.Base64 });
      // console.log("base64_image: "+ base64_image);

      // let base64_image2 = await FileSystem.readAsStringAsync("file:///var/mobile/Containers/Data/Application/07970C02-4ACF-43F7-884C-251C504524B5/Documents/ExponentExperienceData/@anonymous/cubator-7381c1b6-5605-4542-b2be-f4b43643a61c/generated-pictures/3d623062c1b5b0daea0a0d89c34b66e3958a79a9fa16fa7053a92daeabc8afed.jpeg", { encoding: FileSystem.EncodingType.Base64 });
      // console.log("base64_image2: "+ base64_image);

    }
};