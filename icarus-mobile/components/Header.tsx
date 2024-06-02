import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

interface HeaderProps {
  toggleDropdown: () => void;
  showDropdown: boolean;
  logout: () => void;
  navigateToPreviousEntries: () => void;
  navigateToHome: () => void;
  username: string;
}

const Header: React.FC<HeaderProps> = ({
  toggleDropdown,
  showDropdown,
  logout,
  navigateToPreviousEntries,
  navigateToHome,
  username,
}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={toggleDropdown} style={styles.menu}>
        <Text style={styles.hamburger}>☰</Text>
      </TouchableOpacity>
      {showDropdown && (
        <View style={styles.sidebar}>
          <TouchableOpacity onPress={navigateToHome} style={styles.button}>
            <Text>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={navigateToPreviousEntries}
            style={styles.button}
          >
            <Text>Previous Entries</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={logout} style={styles.button}>
            <Text style={styles.logoutText}>LOGOUT</Text>
          </TouchableOpacity>
        </View>
      )}
      <Text style={styles.username}>{username}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#333",
    width: "100%",
    zIndex: 999,
  },
  menu: {
    padding: 10,
  },
  hamburger: {
    color: "#fff",
  },
  sidebar: {
    position: "absolute",
    top: 50,
    left: 10,
    padding: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    zIndex: 1000,
  },
  button: {
    padding: 10,
  },
  logoutText: {
    color: "#f00",
  },
  username: {
    marginRight: 10,
    color: "#fff",
  },
});

export default Header;
