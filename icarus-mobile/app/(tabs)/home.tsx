import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import ProteinGoal from "@/components/ProteinGoal";

export default function Home() {
  const [username, setUsername] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [proteinGoal, setProteinGoal] = useState<string>("0");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const verifyToken = async () => {
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        router.push("login");
        return;
      }
      try {
        const response = await fetch("http://localhost:4000", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.status) {
          setUsername(data.user);
        } else {
          await SecureStore.deleteItemAsync("token");
          router.push("login");
        }
      } catch (error) {
        console.error("Error verifying token", error);
        await SecureStore.deleteItemAsync("token");
        router.push("login");
      }
    };

    verifyToken();
  }, [router]);

  useEffect(() => {
    setIsLoading(true);
    const fetchProteinGoal = async () => {
      const token = await SecureStore.getItemAsync("token");
      if (token) {
        try {
          const response = await fetch(
            "http://localhost:4000/user/getProteinGoal",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = await response.json();
          if (data.proteinGoal) {
            setProteinGoal(data.proteinGoal);
          }
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching protein goal:", error);
          setIsLoading(false);
        }
      }
    };

    fetchProteinGoal();
  }, []);

  const updateProteinGoal = (newGoal: string) => {
    setProteinGoal(newGoal);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("token");
    router.push("login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        toggleDropdown={toggleDropdown}
        showDropdown={showDropdown}
        logout={logout}
        username={username}
      />
      <View style={styles.content}>
        <ProteinGoal
          proteinGoalValue={proteinGoal}
          isLoading={isLoading}
          onUpdate={updateProteinGoal}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
