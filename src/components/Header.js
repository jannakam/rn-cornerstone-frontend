import { StyleSheet, View, DeviceEventEmitter } from "react-native";
import React, { useState, useEffect } from "react";
import { Menu } from "@tamagui/lucide-icons";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { XStack, Image, YStack, Avatar, useTheme } from "tamagui";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import the same avatar options
const avatarOptions = [
  { id: 1, url: require("../../assets/avatars/avatar1.png") },
  { id: 2, url: require("../../assets/avatars/avatar2.png") },
  { id: 3, url: require("../../assets/avatars/avatar3.png") },
  { id: 4, url: require("../../assets/avatars/avatar4.png") },
  { id: 5, url: require("../../assets/avatars/avatar5.png") },
  { id: 6, url: require("../../assets/avatars/avatar6.png") },
  { id: 7, url: require("../../assets/avatars/avatar7.png") },
  { id: 8, url: require("../../assets/avatars/avatar8.png") },
  { id: 9, url: require("../../assets/avatars/avatar9.png") },
];

const Header = ({ navigation }) => {
  const { openDrawer } = navigation;
  const theme = useTheme();
  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0]);

  useEffect(() => {
    // Load saved avatar on component mount
    const loadSavedAvatar = async () => {
      try {
        const savedAvatarId = await AsyncStorage.getItem('userAvatarId');
        if (savedAvatarId) {
          const avatar = avatarOptions.find(a => a.id === parseInt(savedAvatarId));
          if (avatar) {
            setSelectedAvatar(avatar);
          }
        }
      } catch (error) {
        console.log('Error loading avatar:', error);
      }
    };
    loadSavedAvatar();

    // Listen for avatar changes
    const subscription = DeviceEventEmitter.addListener('avatarChanged', (event) => {
      if (event.avatarId) {
        const avatar = avatarOptions.find(a => a.id === event.avatarId);
        if (avatar) {
          setSelectedAvatar(avatar);
        }
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
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Image
            source={require("../../assets/stepwise_logo.png")}
            style={{ width: 25, height: 40 }}
          />
        </TouchableOpacity>
      </YStack>
      <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
        <Avatar circular size="$4" backgroundColor={theme.cyan10.val}>
          <Avatar.Image source={selectedAvatar.url} />
          <Avatar.Fallback backgroundColor={theme.cyan10.val} />
        </Avatar>
      </TouchableOpacity>
    </XStack>
  );
};

export default Header;

const styles = StyleSheet.create({});
