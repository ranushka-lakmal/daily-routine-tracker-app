import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
  Image,
  Platform,
} from 'react-native';
import { saveUser } from '../db/sqlite';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    birthDay: '',
    gender: '',
    userName: '',
    password: '',
    photoUri: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'We need gallery permission to select an image.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setForm({ ...form, photoUri: uri });
    }
  };

  const handleRegister = async () => {
    try {
      if (!form.firstName || !form.userName || !form.password) {
        Alert.alert('Error', 'Please fill all required fields.');
        return;
      }
      await saveUser(form);
      Alert.alert('Success', 'Account created successfully!');
      navigation.replace('Login');
    } catch (error) {
      console.error('Register failed', error);
      Alert.alert('Error', 'Failed to register user.');
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formatted = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD
      setForm({ ...form, birthDay: formatted });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <TouchableOpacity onPress={pickImage}>
          <View style={styles.avatarWrapper}>
            {form.photoUri ? (
              <Image source={{ uri: form.photoUri }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Image
                  source={require('../../assets/camera.png')} // place a camera.png icon in assets folder
                  style={{ width: 40, height: 40, tintColor: '#aaa' }}
                />
              </View>
            )}
            <View style={styles.addIcon}>
              <Text style={{ color: '#fff', fontSize: 22, fontWeight: '600' }}>+</Text>
            </View>
          </View>
        </TouchableOpacity>
        <Text style={styles.uploadText}>Upload Photo</Text>
      </View>

      {/* Name fields */}
      <View style={styles.row}>
        <TextInput
          placeholder="First Name"
          style={[styles.input, { flex: 1, marginRight: 8 }]}
          onChangeText={(v) => setForm({ ...form, firstName: v })}
        />
        <TextInput
          placeholder="Last Name"
          style={[styles.input, { flex: 1, marginLeft: 8 }]}
          onChangeText={(v) => setForm({ ...form, lastName: v })}
        />
      </View>

      <TextInput
        placeholder="you@example.com"
        style={styles.input}
        keyboardType="email-address"
        onChangeText={(v) => setForm({ ...form, email: v })}
      />
      <TextInput
        placeholder="+1 (555) 000-0000"
        style={styles.input}
        keyboardType="phone-pad"
        onChangeText={(v) => setForm({ ...form, mobileNumber: v })}
      />

      {/* Birthday & Gender Row */}
      <View style={styles.row}>
        {/* Birthday Picker */}
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          activeOpacity={0.8}
          style={[styles.input, { flex: 1, marginRight: 8, justifyContent: 'center' }]}
        >
          <Text style={{ color: form.birthDay ? '#000' : '#999', fontSize: 16 }}>
            {form.birthDay ? form.birthDay : 'Select date'}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={form.birthDay ? new Date(form.birthDay) : new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}

        {/* Gender Dropdown */}
        <View style={[styles.input, { flex: 1, marginLeft: 8, padding: 0 }]}>
          <Picker
            selectedValue={form.gender}
            onValueChange={(v) => setForm({ ...form, gender: v })}
            style={{ height: 50 }}
          >
            <Picker.Item label="Select" value="" />
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>
      </View>

      <TextInput
        placeholder="username"
        style={styles.input}
        onChangeText={(v) => setForm({ ...form, userName: v })}
      />
      <TextInput
        placeholder="Create a strong password"
        style={styles.input}
        secureTextEntry
        onChangeText={(v) => setForm({ ...form, password: v })}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <View style={styles.bottomTextContainer}>
        <Text style={styles.bottomText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.replace('Login')}>
          <Text style={styles.loginLink}> Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 15,
    marginTop: 40,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  avatarPlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#f4f4f4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007AFF',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  uploadText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  row: {
    flexDirection: 'row',
    width: '100%',
  },
  input: {
    width: '100%',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  button: {
    backgroundColor: '#007AFF',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  bottomTextContainer: {
    flexDirection: 'row',
    marginTop: 25,
    marginBottom: 40,
  },
  bottomText: {
    color: '#555',
    fontSize: 15,
  },
  loginLink: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 15,
  },
});
