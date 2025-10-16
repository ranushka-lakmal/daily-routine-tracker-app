import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { getDB } from '../db/sqlite';

export default function LoginScreen({ navigation }) {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
  try {
    const db = await getDB();
    const result = await db.getFirstAsync(
      'SELECT * FROM users WHERE userName = ? OR email = ? AND password = ?',
      [userName, userName, password]
    );

    if (result) {
      Alert.alert('Login Success', `Welcome ${result.firstName}`);
      navigation.replace('Main', { screen: 'Home', params: { user: result } });
    } else {
      Alert.alert('Error', 'Invalid username or password');
    }
  } catch (err) {
    console.error('Login error', err);
    Alert.alert('Error', 'Failed to login');
  }
};


  return (
    <ImageBackground
      source={require('../../assets/login-bg.png')} // optional background gradient image
      style={styles.container}
      resizeMode="cover"
    >
      {/* Top icon */}
      <View style={styles.iconContainer}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>!</Text>
        </View>
      </View>

      <Text style={styles.title}>Welcome Back</Text>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Username"
          style={styles.input}
          value={userName}
          onChangeText={setUserName}
        />
        <TextInput
          placeholder="Password"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.forgotContainer}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomTextContainer}>
        <Text style={styles.bottomText}>Don’t have an account?</Text>
        <TouchableOpacity onPress={() => navigation.replace('Register')}>
          <Text style={styles.signUpLink}> Sign up</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f9ff', // fallback if no background image
    paddingHorizontal: 24,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#0097FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 32,
    color: '#0097FF',
    fontWeight: '700',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 25,
    color: '#000',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 12,
  },
  forgotContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  forgotText: {
    color: '#0097FF',
    fontWeight: '500',
    fontSize: 15,
  },
  button: {
    backgroundColor: '#0097FF',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  bottomTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  bottomText: {
    color: '#555',
    fontSize: 15,
  },
  signUpLink: {
    color: '#0097FF',
    fontWeight: '600',
    fontSize: 15,
  },
});
