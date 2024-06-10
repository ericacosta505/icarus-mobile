import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import Header from "@/components/Header";
import PastEntries from "@/components/PastEntries";
import ProteinConsumed from '@/components/ProteinConsumed'

interface Entry {
  _id: string;
  createdAt: string;
  mealName: string;
  proteinAmount: number;
}


export default function PreviousEntries() {
  const formatDate = (date: Date | string): string => {
    let dateObj = new Date(date);
    return `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${dateObj.getDate().toString().padStart(2, "0")}`;
  };

  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [pastEntries, setPastEntries] = useState<Entry[]>([]);
  const [proteinGoal, setProteinGoal] = useState<string>("0");
  const [proteinConsumed, setProteinConsumed] = useState<string>("0");
  const [selectedDate, setSelectedDate] = useState<string>(formatDate(new Date()));

  useEffect(() => {
    const verifyToken = async () => {
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        router.push("login");
        return;
      }
      try {
        const response = await fetch("https://icarus-backend.onrender.com", {
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
    const fetchProteinGoal = async () => {
      const token = await SecureStore.getItemAsync("token");
      if (token) {
        try {
          const response = await fetch(
            "https://icarus-backend.onrender.com/user/getProteinGoal",
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
        } catch (error) {
          console.error("Error fetching protein goal:", error);
        }
      }
    };
    fetchProteinGoal();
  }, []);

  

  const fetchPastEntries = async () => {
    const token = await SecureStore.getItemAsync("token");
    try {
      const response = await fetch(
        "https://icarus-backend.onrender.com/user/getAllPastEntries",
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

  useEffect(() => {
    const totalProteinConsumed = pastEntries.reduce((sum, entry) => {
      return sum + (Number(entry.proteinAmount) || 0);
    }, 0);
    setProteinConsumed(totalProteinConsumed.toString());
  }, [pastEntries]);

  useEffect(() => {
    const selectedEntries = pastEntries.filter(entry => formatDate(new Date(entry.createdAt)) === selectedDate);
    const totalProtein = selectedEntries.reduce((sum, entry) => sum + Number(entry.proteinAmount), 0);
    setProteinConsumed(totalProtein.toString());
  }, [selectedDate, pastEntries]); 
  
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
      <PastEntries pastEntries={pastEntries} onEntryDelete={()=>{
        fetchPastEntries()
      }} onDateChange={setSelectedDate}/>
      <ProteinConsumed proteinGoalValue={proteinGoal} proteinConsumed={proteinConsumed} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
});
