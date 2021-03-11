import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { useAssets } from 'expo-asset';
import * as ImageManipulator from 'expo-image-manipulator';

const HEIGHT = 60;
let gated = false;
export default function App() {
  const [assets] = useAssets([require('./assets/badfile.jpeg')]);
  const [previews,setPreviews] = useState([]);
  const [uris,setUris] = useState([]);
  const manipulate = async (index) => {
    console.log('manipulating',index)
      const { uri:previewURI } = await ImageManipulator.manipulateAsync(
        uris[index],
        [{ 
          resize: {
            height:HEIGHT
          } 
        }],
        {
          compress:0,
          format:ImageManipulator.SaveFormat.PNG
        }
      );
      setPreviews([...previews,previewURI]);
  };

  useEffect(() => {
    if(assets && assets.length) {
      const [{ localUri }] = assets;
      const uriArray = Array(20).fill(localUri);
      setUris(uriArray);
    }
  },[assets]);

  useEffect(() => {
    if(uris && uris.length) {
      if(!gated) {
        manipulate(0);
        gated = true;
      }
    }
  },[uris]);

  useEffect(() => {
    const lPrev = previews.length;
    if(lPrev < uris.length) {
      setTimeout(() => {
        manipulate(lPrev);
      },5000);
    }
  },[previews]);

  return (
    <View style={styles.container}>
      {previews.map((preview,index) => 
        <Image
          key={index}
          source={{ uri:preview }}
          style={{
            height:HEIGHT,
            width:HEIGHT
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
