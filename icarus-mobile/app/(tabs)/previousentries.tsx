import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import Header from "@/components/Header";
import PastEntries from "@/components/PastEntries";

export default function PreviousEntires() {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [pastEntries, setPastEntries] = useState([]);

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

  const fetchPastEntries = async () => {
    const token = await SecureStore.getItemAsync("token");
    try {
      const response = await fetch(
        "http://localhost:4000/user/getAllPastEntries",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      const data = await response.json();
      if (data && data.pastEntries) {
        setPastEntries(data.pastEntries);
      }
    } catch (error) {
      console.error("There was an error loading past entries:", error);
    }
  };

  useEffect(() => {
    fetchPastEntries();
  }, []);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("token");
    router.push("login");
  };

  const navigateToPreviousEntries = () => {
    router.push("previousentries");
  };

  const navigateToHome = () => {
    router.push("home");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        toggleDropdown={toggleDropdown}
        showDropdown={showDropdown}
        logout={logout}
        navigateToPreviousEntries={navigateToPreviousEntries}
        navigateToHome={navigateToHome}
        username={username}
      />
      <PastEntries pastEntries={pastEntries} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
});
