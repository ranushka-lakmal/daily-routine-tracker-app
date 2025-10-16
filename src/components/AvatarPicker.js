import React, { useState } from 'react';
import { View, Image, Button, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function AvatarPicker({ onPick }) {
  const [imageUri, setImageUri] = useState(null);

  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'We need gallery access to select images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      onPick(uri);
    }
  };

  const pickFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'We need camera access to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      onPick(uri);
    }
  };

  return (
    <View style={{ alignItems: 'center', marginBottom: 20 }}>
      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={{ width: 120, height: 120, borderRadius: 60, marginBottom: 10 }}
        />
      )}
      <Button title="Pick from Gallery" onPress={pickFromGallery} />
      <View style={{ height: 10 }} />
      <Button title="Take a Photo" onPress={pickFromCamera} />
    </View>
  );
}
