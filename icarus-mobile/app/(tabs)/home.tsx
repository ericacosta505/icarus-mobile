import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Switch } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';

export default function Home(){
  const [username, setUsername] = useState<string>('');
  const router = useRouter()

  useEffect(() => {
    const verifyToken = async () => {
      const token = await SecureStore.getItemAsync('token');
      if (!token) {
        router.push("login");
        return;
      }
      try {
        const response = await fetch('http://localhost:4000', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.status) {
          setUsername(data.user);
        } else {
          SecureStore.deleteItemAsync('token');
          router.push("login");
        }
      } catch (error) {
        console.error('Error verifying token', error);
        SecureStore.deleteItemAsync('token');
        router.push("login")
      }
    };
    verifyToken();
  }, []);


  return (
    <View style={styles.container}>
      <Text>Welcome {username}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
