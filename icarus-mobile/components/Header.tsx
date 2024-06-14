import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
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
  const handleNavigateToHome = () => {
    navigateToHome();
    toggleDropdown();
  };

  const handleNavigateToPreviousEntries = () => {
    navigateToPreviousEntries();
    toggleDropdown();
  };

  const handleLogout = () => {
    logout();
    toggleDropdown();
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={toggleDropdown} style={styles.menu}>
        <Text style={styles.hamburger}>☰</Text>
      </TouchableOpacity>
      <Modal
        visible={showDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={toggleDropdown}
      >
        <View style={styles.modalBackground}>
          <View style={styles.sidebar}>
            <TouchableOpacity
              onPress={handleNavigateToHome}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleNavigateToPreviousEntries}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Previous Entries</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} style={styles.button}>
              <Text style={[styles.buttonText, styles.logoutText]}>Logout</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={toggleDropdown}
          />
        </View>
      </Modal>
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
  modalBackground: {
    flex: 1,
    flexDirection: "row",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  sidebar: {
    width: 250,
    backgroundColor: "#444",
    paddingTop: 80,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 15,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
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
    color: "#fff",
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
