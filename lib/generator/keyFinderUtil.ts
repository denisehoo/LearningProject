import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';
import axios, { AxiosHeaders } from 'axios';

// Hypothetical function to replace Puppeteer-based scraping
export async function fetchUserKeyFromAPI(){
  try {
    let headers = new AxiosHeaders();

    headers.setContentType('Content-Type', 'application/json');
    headers.setAccept('Accept', 'application/json');
    headers.set("Access-Control-Allow-Origin", "*");

    const response = await axios.get('http://192.168.1.38:5000/getkey', {headers: headers});

   if (response.status == 200) {
      return response.data.key.toString(); // the return json is key instead of userKey
    } else {
      Alert.alert("Key API returned status code", response.status.toString());
    }

    return null;
  } catch (error:any) {
    Alert.alert("fetchKeyAPI: ", error.message);
    return null;
  }
}

export async function saveUserKey(userKey: string): Promise<void> {
  
  const path = `${FileSystem.documentDirectory}/last-key.json`

  await FileSystem.writeAsStringAsync(path, JSON.stringify({ userKey: userKey }), {
    encoding: FileSystem.EncodingType.UTF8,
  });
}

export async function getKey(): Promise<string | null> {
  let foundUserKey: string | null = null;
  const path = `${FileSystem.documentDirectory}/last-key.json`;

  try {
    const fileExists = (await FileSystem.getInfoAsync(path)).exists;
    
    if (fileExists) {
      const fileContent = await FileSystem.readAsStringAsync(path); 
      const verificationUrl = 'https://image-generation.perchance.org/api/checkVerificationStatus';
      const { userKey } = JSON.parse(fileContent);
      const cacheBust = Math.random();
      const verificationParams = {
        userKey: userKey,
        __cacheBust: cacheBust
      };

      const response = await axios.get(verificationUrl, { params: verificationParams });
      if (response.data.status !=='not_verified') {
        foundUserKey = userKey;
        return foundUserKey;
      }
    }

    foundUserKey = await fetchUserKeyFromAPI();

    if(foundUserKey) {
      saveUserKey(foundUserKey);
      return foundUserKey;
    }
    else {  
      return null;
    }

  } catch (error) {
    Alert.alert('Error', 'Failed to fetch or save key.');
    return null;
  }
}
