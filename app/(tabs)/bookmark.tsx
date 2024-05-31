import { View, Text , Image} from 'react-native'
import React, { useEffect, useState } from 'react'
import * as FileSystem from 'expo-file-system';
import { readFileFromLocal } from '../../lib/generator/fetchImageUtil';


const Bookmark = () => {

  const [item, setItem] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        readFileFromLocal(FileSystem.documentDirectory+"new1.jpeg").then((res:any) => {
          console.log("Read:" + res);
          setItem(res);
        })
      } catch (error) {
        console.error(error);
      }
    };

    fetchItem();
  }, []);

  return (
    <View>
      <Text>Bookmark</Text>
      {item ? (
        <Image source={{ uri: `data:image/jpeg;base64,${item}` }} className="w-[100%] h-[600px] relative mb-4"/>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  )
}

export default Bookmark