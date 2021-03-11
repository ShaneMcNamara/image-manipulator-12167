import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { useAssets } from 'expo-asset';
import * as ImageManipulator from 'expo-image-manipulator';

const HEIGHT = 60;
export default function App() {
  const [assets] = useAssets([require('./assets/badfile.jpeg')]);
  const [previews,setPreviews] = useState([]);
  useEffect(() => {
    const manipulate = async (uris) => {
      const previews = await Promise.all(uris.map(async (uri) => {
        const { uri:previewURI } = await ImageManipulator.manipulateAsync(
            uri,
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
          return previewURI;
        })
      );
      setPreviews(previews);
    };
    if(assets && assets.length) {
      const [{ localUri }] = assets;
      const uriArray = Array(10).fill(localUri);
      manipulate(uriArray);
    }
  },[assets]);


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
