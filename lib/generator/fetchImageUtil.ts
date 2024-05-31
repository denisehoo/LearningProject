import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import axios from 'axios';
import { encode, replaceRandomWords } from './utils';
import  { getStyleByName, StyleDataProp }  from './styles';
import MySentencelist from './wordlist';


const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1]; // Remove data URL prefix
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const fetchImage = async (imageId:string): Promise<string> => {
  try {
    const params = { imageId: imageId };
    const response = await axios.get('https://image-generation.perchance.org/api/downloadTemporaryImage', {
      params,
      responseType: 'blob',
    });
    const base64 = await blobToBase64(response.data);
    //const url = URL.createObjectURL(response.data);

    return base64;
  } catch (error) {
    console.error('Error fetching image:', error);
    throw error;
  }
};

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

    console.log("promptQuery: "+promptQuery);
    console.log("negativePromptQuery: "+negativePromptQuery);

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
    channel: 'ai-text-to-image-generator',
    subChannel: 'public',
    requestId: requestId
  };

  const createResponse = await axios.get(createUrl, { params: createParams });

  if (createResponse.data.status === 'not_verified') {
    throw new Error('(invalid key) Generate again.');
  }
  
  console.log("got create response " + createResponse.data.imageId);

  let imageId: string | null = null;
  while (!imageId) {
    try {
      imageId = createResponse.data.imageId;
    } catch {
      await new Promise(resolve => setTimeout(resolve, 8000));
    }
  }

  return { imageId: imageId };
};

export async function writeFileIntoFS(base64String: string, fileName: string) {
  try {
    const fileUri = `${FileSystem.documentDirectory}${fileName}`;
    await FileSystem.writeAsStringAsync(fileUri, "data:image/jpeg;base64"+base64String);
    console.log('File written to:', fileUri);
    await Sharing.shareAsync(fileUri);
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if(fileInfo.exists) {
      MediaLibrary.isAvailableAsync().then((isAvailable) => {
        if (!isAvailable) {
          console.log("Media Library not available");
          return;
        }
      })
      MediaLibrary.saveToLibraryAsync(fileUri);
    }
    else {
      console.log("File does not exist");
    }

    return fileUri;
  } catch (error) {
    console.error('Error writing file:', error);
    throw error;
  }
};

export const saveToDevice = async (uri: string) => {
  try {
    // Request device storage access permission
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === 'granted') {
      // Save image to media library
      await MediaLibrary.saveToLibraryAsync(uri);
      console.log('Image saved to library');
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync('Download', asset, false);
      console.log('Image successfully saved');
    } else {
      console.error('Permission denied');
    }
  } catch (error) {
    console.log('Error saving image:', error);
  }
};

export async function readFileFromLocal(filePath: string) {
  const directory = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory+"img/");
  console.log("Directory count: "+directory.length);
  const fileContent = await FileSystem.readAsStringAsync(filePath);
  return fileContent;
}

