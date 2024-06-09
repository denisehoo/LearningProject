import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";

import axios from 'axios';
import { encode, replaceRandomWords } from './utils';
import  { getStyleByName, StyleDataProp }  from './styles';
import MySentencelist from './wordlist';
import { Alert } from 'react-native';

interface ImageData {
  extension: string;
  content: string;
}


const blobToBase64 = (blob: Blob): Promise<ImageData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;

      const matches = result.match(/^data:image\/(.*?);base64,(.*)$/);
  
      if (!matches || matches.length !== 3) {
        Alert.alert("Invalid base64 image string");
        return null;
      }
    
      const extension = matches[1];
      const content = matches[2];
    
      resolve({
        extension,
        content
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const getFileExtension = (filePath: string): string | null => {
  // Use a regular expression to match the file extension
  const match = filePath.match(/\.([a-zA-Z0-9]+)$/);
  
  // Return the file extension if found, otherwise return null
  return match ? match[1] : null;
};

export async function getFileSize(fileUri: string) {
  let fileSize=0;
  
  await FileSystem.getInfoAsync(fileUri, {size: true}).then((res:any) => { 
    fileSize = res.size;
  }); 

  return fileSize;
}

export function formFinalPrompts(prompt = 'RANDOM', negativePrompt = '', style = 'RANDOM')
{
  let promptBase: string;
    if (prompt === 'RANDOM') {
      const sentencelist = new MySentencelist();
      const samplePrompt = sentencelist.getPrompt(1);
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

    return {promptQuery: promptQuery, negativePromptQuery: negativePromptQuery};
};

export async function getImageId(
  promptQuery: string, 
  negativePromptQuery:string,
  userKey = '',
  resolution = '512x768',
  guidanceScale = 7
){

  const createUrl = 'https://image-generation.perchance.org/api/generate';
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
    channel: 'ai-pokemon-generator', //ai-pokemon-generator //ai-text-to-image-generator
    subChannel: 'public',
    requestId: requestId
  };

  const createResponse = await axios.get(createUrl, { params: createParams });

  if (createResponse.data.status === 'not_verified') {
    Alert.alert("Invalid key: ", "Please generate image again.");
  }
  

  let imageId: string | null = null;
  while (!imageId) {
    try {
      imageId = createResponse.data.imageId;
    } catch {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return { imageId: imageId };
};

export const fetchImage = async (imageId:string): Promise<ImageData> => {
  try {
    const params = { imageId: imageId };
    const response = await axios.get('https://image-generation.perchance.org/api/downloadTemporaryImage', {
      params,
      responseType: 'blob',
    });
    const base64 = await blobToBase64(response.data);

    return base64;
  } catch (error: any) {
    Alert.alert("fetchImage: ", error.message);
    return {extension:"", content:""};
  }
};

export async function writeFileIntoCache(base64Image: string, extension: string , fileName: string) {
  const fileUri = `${FileSystem.documentDirectory}/${fileName}.${extension}`;

  try {
    await FileSystem.writeAsStringAsync(fileUri, base64Image, { encoding: FileSystem.EncodingType.Base64 });
    return fileUri;
  } catch (error : any) {

    Alert.alert("Failed to write local image: ", error.message);

    return "";
  }
};

export const saveToDevice = async (localUri: string, newName: string, albumName: string) => {

    try {
      // Request media library permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access media library is required!');
        return;
      }

      // Save the file to the media library
      let extension =  getFileExtension(localUri);
      const base64Image = await FileSystem.readAsStringAsync(localUri, { encoding: FileSystem.EncodingType.Base64 });
      const fileUri = await writeFileIntoCache(base64Image, extension?extension:"JPEG", newName);

      const album = await MediaLibrary.getAlbumAsync(albumName);

      if(album !== null) {
        const asset = await MediaLibrary.createAssetAsync(fileUri);
        await MediaLibrary.addAssetsToAlbumAsync(asset, album, false);
      }
      else{
        const asset = await MediaLibrary.createAssetAsync(fileUri);
        await MediaLibrary.createAlbumAsync(albumName, asset, false);
      }
      
      Alert.alert('Image saved to album !');
    } catch (error:any) {
      Alert.alert("Failed to save to album",error.message);
    }
};

