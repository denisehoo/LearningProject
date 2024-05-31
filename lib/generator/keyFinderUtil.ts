import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';
import axios, { AxiosHeaders } from 'axios';

// Hypothetical function to replace Puppeteer-based scraping
export async function fetchUserKeyFromAPI(): Promise<string> {
  try {
    let headers = new AxiosHeaders();

    headers.setContentType('Content-Type', 'application/json');
    headers.setAccept('Accept', 'application/json');
    headers.set("Access-Control-Allow-Origin", "*");

    const response = await axios.get('http://yourhost:5000/getkey', {headers: headers});
    console.log("response.data.userKey: "+response.data.key);
    return response.data.key.toString(); 
/*     if (response.status === 200) {
      return response.data.userKey; 
    } else {
      throw new Error('Failed to fetch user key');
    } */
  } catch (error) {
    console.error('Error fetching user key from API:', error);
    throw error;
  }
}

export async function saveKey(key: string): Promise<void> {
  
  const path = `${FileSystem.documentDirectory}/last-key.json`

  console.log(`Found key ${key.substring(0, 10)}...`);

  await FileSystem.writeAsStringAsync(path, JSON.stringify({ userKey: key }), {
    encoding: FileSystem.EncodingType.UTF8,
  });
}

export async function getKey(): Promise<string | null> {
  let key: string | null = null;
  const path = `${FileSystem.documentDirectory}/last-key.json`;

  try {
    const fileExists = (await FileSystem.getInfoAsync(path)).exists;
    console.log(path);
    if (fileExists) {
      const fileContent = await FileSystem.readAsStringAsync(path); console.log(fileContent.toString());
      const verificationUrl = 'https://image-generation.perchance.org/api/checkVerificationStatus';
      const { userKey } = JSON.parse(fileContent);
      const cacheBust = Math.random();
      const verificationParams = {
        userKey: userKey,
        __cacheBust: cacheBust
      };

      const response = await axios.get(verificationUrl, { params: verificationParams });
      if (response.data.status !=='not_verified') {
        key = userKey;
        console.log(`Found working key `+ key?.substring(0, 10)+`... in file.`);
        return key;
      }
    }

    console.log('Key no longer valid. Looking for a new key...');

    key = await fetchUserKeyFromAPI();
    saveKey(key);

    return key;

  } catch (error) {
    console.error('Error fetching or saving key:', error);
    Alert.alert('Error', 'Failed to fetch or save key.');
    return null;
  }
}
