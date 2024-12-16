import { StyleSheet, View, DeviceEventEmitter } from "react-native";
import React, { useState, useEffect } from "react";
import { Menu } from "@tamagui/lucide-icons";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { XStack, Image, YStack, Avatar, useTheme } from "tamagui";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Header = ({ navigation }) => {
  const { openDrawer } = navigation;
  const theme = useTheme();
  const [avatarUrl, setAvatarUrl] = useState("https://api.dicebear.com/7.x/avataaars/png?seed=Felix");

  useEffect(() => {
    // Load saved avatar on component mount
    const loadSavedAvatar = async () => {
      try {
        const savedAvatar = await AsyncStorage.getItem('userAvatar');
        if (savedAvatar) {
          setAvatarUrl(savedAvatar);
        }
      } catch (error) {
        console.log('Error loading avatar:', error);
      }
    };
    loadSavedAvatar();

    // Listen for avatar changes
    const subscription = DeviceEventEmitter.addListener('avatarChanged', (event) => {
      if (event.avatarUrl) {
        setAvatarUrl(event.avatarUrl);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <XStack ai="center" jc="space-between" p="$4" pt="$11">
      <TouchableOpacity onPress={openDrawer}>
        <Menu size={24} color="$color" />
      </TouchableOpacity>
      <YStack>
        <Image
          source={require("../../assets/stepwise_logo.png")}
          style={{ width: 25, height: 40 }}
        />
      </YStack>
      <TouchableOpacity onPress={() => navigation.navigate("ProfileScreen")}>
        <Avatar circular size="$5" backgroundColor={theme.cyan10.val}>
          <Avatar.Image source={{ uri: avatarUrl }} />
          <Avatar.Fallback backgroundColor={theme.cyan10.val} />
        </Avatar>
      </TouchableOpacity>
    </XStack>
  );
};

export default Header;

const styles = StyleSheet.create({});
