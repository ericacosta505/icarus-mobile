import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import ProteinGoal from "@/components/ProteinGoal";
import ProteinConsumed from "@/components/ProteinConsumed";
import DateDisplay from "@/components/DateDisplay";
import AddEntryForm from "@/components/AddEntryForm";
import EntryList from "@/components/EntryList";

export default function Home() {
  const [username, setUsername] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [proteinGoal, setProteinGoal] = useState<string>("0");
  const [proteinConsumed, setProteinConsumed] = useState<string>("0");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEntryLoading, setisEntryLoading] = useState<boolean>(true);
  const [todaysEntries, setTodaysEntries] = useState([]);
  const [pastEntries, setPastEntries] = useState([]);
  const [entryDeleted, setEntryDeleted] = useState(false);
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

  const fetchSumTodaysEntries = async () => {
    const token = await SecureStore.getItemAsync("token");
    try {
      const response = await fetch(
        "http://localhost:4000/user/sumTodaysEntries",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.totalProteinToday !== undefined) {
        setProteinConsumed(data.totalProteinToday);
      } else {
        setProteinConsumed("0");
      }
    } catch (error) {
      console.error("Error fetching sum of today's entries:", error);
      setProteinConsumed("0");
    }
  };

  const fetchTodaysEntries = async () => {
    const token = await SecureStore.getItemAsync("token");
    try {
      setisEntryLoading(true);
      const response = await fetch(
        "http://localhost:4000/user/getTodaysEntries",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      const data = await response.json();

      if (data.todaysEntries) {
        setTodaysEntries(data.todaysEntries);
        setisEntryLoading(false);
      }
    } catch (error) {
      console.error("Error fetching today's entries:", error);
      setisEntryLoading(false);
    }
  };

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

  useEffect(() => {
    fetchTodaysEntries();
  }, [entryDeleted]);

  useEffect(() => {
    fetchSumTodaysEntries();
  }, [entryDeleted]);

  const updateProteinGoal = (newGoal: string) => {
    setProteinGoal(newGoal);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleEntryDelete = () => {
    setEntryDeleted(!entryDeleted);
    fetchSumTodaysEntries();
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
        <View style={styles.doubleContainer}>
          <ProteinGoal
            proteinGoalValue={proteinGoal}
            isLoading={isLoading}
            onUpdate={updateProteinGoal}
          />
          <DateDisplay />
        </View>
        <ProteinConsumed
          proteinGoalValue={proteinGoal}
          proteinConsumed={proteinConsumed}
        />
        <AddEntryForm
          onEntryAdded={() => {
            fetchTodaysEntries();
            fetchSumTodaysEntries();
            fetchPastEntries();
          }}
        />
        <EntryList
          todaysEntries={todaysEntries}
          isEntryLoading={isEntryLoading}
          onEntryDelete={() => {
            fetchTodaysEntries();
            fetchPastEntries();
          }}
          handleEntryDelete={handleEntryDelete}
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
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  doubleContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
});
