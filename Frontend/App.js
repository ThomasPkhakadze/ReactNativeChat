import { StatusBar } from 'expo-status-bar';
import {useState, useEffect} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Navigation from './src/components/Navigation';
import { AuthProvider } from './src/context/AuthContext';
import { ChatProvider } from './src/context/ChatContext';

export default function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <Navigation />
      </ChatProvider>
    </AuthProvider>
  );
}