import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
} from "react-native";
import logov2 from "../assets/images/logov2-removebg-preview.png";

const { width, height } = Dimensions.get("window");

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
    padding: width * 0.025,
    backgroundColor: "#333",
    width: "100%",
    zIndex: 999,
    height: height * 0.07,
  },
  menu: {
    padding: width * 0.025,
  },
  hamburger: {
    color: "#fff",
    fontSize: width * 0.06,
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
    width: width * 0.5,
    backgroundColor: "#454545",
    paddingTop: height * 0.075,
    paddingLeft: width * 0.0375,
    paddingRight: width * 0.0375,
    paddingBottom: height * 0.01875,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  button: {
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.0375,
  },
  buttonText: {
    color: "#fff",
    fontSize: width * 0.04,
  },
  logoutText: {
    color: "#fff",
  },
  logo: {
    height: height * 0.0625,
    width: height * 0.0625,
  },
  username: {
    marginRight: width * 0.025,
    color: "#fff",
    fontSize: width * 0.04,
  },
});

export default Header;
