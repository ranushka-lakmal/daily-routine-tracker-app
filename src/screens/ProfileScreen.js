import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getFirstUser, deleteAllUsers } from '../db/sqlite';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await getFirstUser();
      if (userData) {
        setUser(userData);
      } else {
        console.log('⚠️ No user found in SQLite');
      }
    } catch (error) {
      console.error('Error fetching user data from SQLite:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        onPress: async () => {
          await deleteAllUsers();
          navigation.replace('Login');
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={{ color: '#555' }}>No user data found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity onPress={() => Alert.alert('Edit Profile Coming Soon')}>
          <Text style={styles.edit}>Edit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.avatarContainer}>
        <Image
          source={
            user.photoUri
              ? { uri: user.photoUri }
              : require('../../assets/default_avatar.png')
          }
          style={styles.avatar}
        />
        <Text style={styles.name}>
          {user.firstName} {user.lastName}
        </Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      <View style={styles.infoCard}>
        <Ionicons name="call-outline" size={24} color="#007AFF" style={styles.icon} />
        <View>
          <Text style={styles.label}>Mobile</Text>
          <Text style={styles.value}>{user.mobileNumber}</Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <Ionicons name="calendar-outline" size={24} color="#007AFF" style={styles.icon} />
        <View>
          <Text style={styles.label}>Birthday</Text>
          <Text style={styles.value}>{user.birthDay}</Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <Ionicons
          name={user.gender === 'Male' ? 'male-outline' : 'female-outline'}
          size={24}
          color="#007AFF"
          style={styles.icon}
        />
        <View>
          <Text style={styles.label}>Gender</Text>
          <Text style={styles.value}>{user.gender}</Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <Ionicons name="at-outline" size={24} color="#007AFF" style={styles.icon} />
        <View>
          <Text style={styles.label}>Username</Text>
          <Text style={styles.value}>{user.userName}</Text>
        </View>
      </View>

      {/* <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FBFF',
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
  },
  edit: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#e0e0e0',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    marginTop: 10,
  },
  email: {
    fontSize: 15,
    color: '#666',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 16,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    marginRight: 15,
    backgroundColor: '#E6F0FF',
    padding: 8,
    borderRadius: 10,
  },
  label: {
    color: '#777',
    fontSize: 13,
  },
  value: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginVertical: 30,
  },
  logoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FBFF',
  },
});
