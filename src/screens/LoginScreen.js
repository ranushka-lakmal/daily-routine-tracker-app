import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import { getDB } from '../db/sqlite';

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  // Animated floating circle
  const offsetY = useSharedValue(0);
  useEffect(() => {
    offsetY.value = withRepeat(withSequence(withTiming(-10, { duration: 1500 }), withTiming(10, { duration: 1500 })), -1, true);
  }, []);

  const animatedCircleStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: offsetY.value }],
  }));

  const handleLogin = async () => {
    try {
      const db = await getDB();
      const result = await db.getFirstAsync(
        'SELECT * FROM users WHERE (userName = ? OR email = ?) AND password = ?',
        [userName, userName, password]
      );
      if (result) {
        Alert.alert('Login Success', `Welcome ${result.firstName}`);
        navigation.replace('Home', { user: result });
      } else {
        Alert.alert('Error', 'Invalid username or password');
      }
    } catch (err) {
      console.error('Login error', err);
      Alert.alert('Error', 'Failed to login');
    }
  };

  return (
    <LinearGradient
      colors={['#E9F5FF', '#DDF3FF', '#C8EAFF']}
      style={styles.container}
    >
      {/* Animated floating circle */}
      <Animated.View style={[styles.circle, animatedCircleStyle]} />

      <View style={styles.card}>
        <Text style={styles.icon}>!</Text>
        <Text style={styles.title}>Welcome Back</Text>

        <TextInput
          placeholder="Email/Username"
          style={styles.input}
          value={userName}
          onChangeText={setUserName}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.forgotContainer}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <LinearGradient
            colors={['#0097FF', '#0076FF']}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Login</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.bottomTextContainer}>
          <Text style={styles.bottomText}>Don’t have an account?</Text>
          <TouchableOpacity onPress={() => navigation.replace('Register')}>
            <Text style={styles.signUpLink}> Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    position: 'absolute',
    top: height * 0.1,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#B3E5FF',
    opacity: 0.4,
  },
  card: {
    width: '85%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    paddingVertical: 40,
    paddingHorizontal: 25,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
  },
  icon: {
    textAlign: 'center',
    fontSize: 40,
    color: '#0097FF',
    borderWidth: 3,
    borderColor: '#0097FF',
    borderRadius: 40,
    width: 70,
    height: 70,
    lineHeight: 62,
    alignSelf: 'center',
    fontWeight: '700',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 25,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
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
    color: '#007AFF',
    fontWeight: '500',
    fontSize: 15,
  },
  button: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  bottomTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  bottomText: {
    color: '#444',
    fontSize: 15,
  },
  signUpLink: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 15,
  },
});
