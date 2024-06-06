import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import logov2 from "../assets/images/logov2-removebg-preview.png";

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
            <Text style={styles.buttonText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={navigateToPreviousEntries}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Previous Entries</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={logout} style={styles.button}>
            <Text style={[styles.buttonText, styles.logoutText]}>LOGOUT</Text>
          </TouchableOpacity>
        </View>
      )}
      <Image style={styles.logo} source={logov2}></Image>
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
    fontSize: 24,
  },
  sidebar: {
    position: "absolute",
    top: 50,
    left: 10,
    padding: 15,
    backgroundColor: "#444",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    zIndex: 1000,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  logoutText: {
    color: "#f00",
  },
  logo: {
    height: 50,
    width: 50,
  },
  username: {
    marginRight: 10,
    color: "#fff",
    fontSize: 16,
  },
});

export default Header;
