import React from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation, route }) {
  const { user } = route.params || {};

  return (
    <View style={styles.container}>
      {user?.photoUri ? (
        <Image source={{ uri: user.photoUri }} style={styles.avatar} />
      ) : null}
      <Text style={styles.title}>Welcome {user?.firstName || 'User'}!</Text>
      <Button title="Logout" onPress={() => navigation.replace('Login')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, marginTop: 10, marginBottom: 20 },
  avatar: { width: 120, height: 120, borderRadius: 60 }
});
