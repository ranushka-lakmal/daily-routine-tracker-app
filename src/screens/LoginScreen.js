import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ImageBackground,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getDB } from '../db/sqlite';

export default function LoginScreen({ navigation }) {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      const db = await getDB();
      const result = await db.getFirstAsync(
        'SELECT * FROM users WHERE (userName = ? OR email = ?) AND password = ?',
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
      source={require('../../assets/login-bg.png')}
      style={styles.container}
      resizeMode="cover"
    >
      {/* Top animated GIF */}
      <View style={styles.gifContainer}>
        <Image
          source={require('../../assets/login_users.gif')}
          style={styles.gif}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>Welcome Back</Text>

      <View style={styles.inputContainer}>
        {/* Username Field */}
        <TextInput
          placeholder="Username or Email"
          style={styles.input}
          value={userName}
          onChangeText={setUserName}
          placeholderTextColor="#888"
        />

        {/* Password Field with Eye Icon */}
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Password"
            style={styles.passwordInput}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#888"
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={showPassword ? 'eye' : 'eye-off'}
              size={22}
              color="#888"
            />
          </TouchableOpacity>
        </View>

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
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 24,
  },
  gifContainer: {
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  gif: {
    width: 180,
    height: 180,
  },
  title: {
    fontSize: 26,
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
    color: '#000',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    paddingVertical: 14,
  },
  eyeIcon: {
    padding: 6,
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
