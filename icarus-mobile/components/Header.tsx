import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface HeaderProps {
  toggleDropdown: () => void;
  showDropdown: boolean;
  logout: () => void;
  username: string;
}

const Header: React.FC<HeaderProps> = ({ toggleDropdown, showDropdown, logout, username }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={toggleDropdown} style={styles.menu}>
        <Text>☰</Text>
      </TouchableOpacity>
      {showDropdown && (
        <View style={styles.sidebar}>
          <TouchableOpacity onPress={logout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>LOGOUT</Text>
          </TouchableOpacity>
        </View>
      )}
      <Text style={styles.username}>{username}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#f8f8f8',
    width: '100%',
    marginTop: 35
  },
  menu: {
    padding: 10,
  },
  sidebar: {
    position: 'absolute',
    top: 50,
    left: 10,
    padding: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    zIndex: 1,
  },
  logoutButton: {
    padding: 10,
  },
  logoutText: {
    color: '#f00',
  },
  username: {
    marginRight: 10,
  },
});

export default Header;
