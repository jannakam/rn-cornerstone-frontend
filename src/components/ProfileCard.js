import React, { useState, useEffect } from "react";
import {
  Card,
  YStack,
  XStack,
  Text,
  Avatar,
  Button, Sheet,
  useTheme,
  Spinner,
} from "tamagui";
import { History, ChevronRight, Store, Footprints, Flame, Edit2, X } from "@tamagui/lucide-icons";
import { useNavigation } from "@react-navigation/native";
import { Platform, DeviceEventEmitter, ScrollView, Animated } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../api/Auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

const theme = useTheme();
const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0]);
const [hoveredAvatar, setHoveredAvatar] = useState(null);

// Predefined list of avatars
const avatarOptions = [
  { id: 1, url: require("../../assets/avatars/avatar1.png") },
  { id: 2, url: require("../../assets/avatars/avatar2.png") },
  { id: 3, url: require("../../assets/avatars/avatar3.png") },
  { id: 4, url: require("../../assets/avatars/avatar4.png") },
  { id: 5, url: require("../../assets/avatars/avatar5.png") },
  { id: 6, url: require("../../assets/avatars/avatar6.png") },
  { id: 7, url: require("../../assets/avatars/avatar7.png") },
  { id: 9, url: require("../../assets/avatars/avatar9.png") },
];

const ProfileCard = () => {
  const navigation = useNavigation();

  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
  });


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
  }, []);

  const handleAvatarSelect = async (avatar) => {
    setSelectedAvatar(avatar);
    try {
      await AsyncStorage.setItem('userAvatarId', avatar.id.toString());
      // Emit event for avatar change
      DeviceEventEmitter.emit('avatarChanged', { avatarId: avatar.id });
    } catch (error) {
      console.log('Error saving avatar:', error);
    }
  };

  const navigateToStore = () => {
    navigation.navigate("Store", {
      animation: "slide_from_right",
      ...Platform.select({
        ios: {
          options: {
            transitionSpec: {
              open: {
                animation: "spring",
                config: {
                  stiffness: 1000,
                  damping: 500,
                  mass: 3,
                  overshootClamping: true,
                  restDisplacementThreshold: 0.01,
                  restSpeedThreshold: 0.01,
                },
              },
              close: {
                animation: "spring",
                config: {
                  stiffness: 1000,
                  damping: 500,
                  mass: 3,
                },
              },
            },
          },
        },
        android: {
          options: {
            animation: "slide_from_right",
            animationDuration: 300,
          },
        },
      }),
    });
  };

  if (isLoading) {
    return (
      <Card
        elevate
        bordered
        animation="bouncy"
        backgroundColor="$background"
        padding="$4"
        width="100%"
      >
        <YStack
          space="$4"
          alignItems="center"
          justifyContent="center"
          height={300}
        >
          <Spinner size="large" color="$color" />
          <Text>Loading profile...</Text>
        </YStack>
      </Card>
    );
  }

  if (error) {
    return (
      <Card
        elevate
        bordered
        animation="bouncy"
        backgroundColor="$background"
        padding="$4"
        width="100%"
      >
        <YStack
          space="$4"
          alignItems="center"
          justifyContent="center"
          height={300}
        >
          <Text color="$red10">Error loading profile</Text>
          <Text color="$red10" fontSize="$2">
            {error.message}
          </Text>
        </YStack>
      </Card>
    );
  }

  return (
    <>
    <Card
    elevate
    size="$4"
    bordered
    animation="bouncy"
    scale={0.9}
    hoverStyle={{ scale: 0.925 }}
    color="$background"
    borderColor="$color4"
    bw={1}
  >
    <Card.Header padded>
      <XStack jc="space-between" ai="center">
        <Text color="$color" fontSize="$8" fontWeight="bold">
        {profile?.username || "Loading..."}
        </Text>
        <Button
          size="$3"
          variant="outlined"
          onPress={navigateToStore}
          icon={Store}
          borderRadius="$10"
          bw={1}
          backgroundColor="$background"
          borderColor={theme.color8.val}
          color={theme.color.val}
        >Store</Button>
      </XStack>
    </Card.Header>

    <Card.Footer padded f={1} pt="$0">
      <YStack space="$5" width="100%">
        <XStack space="$2">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <XStack space="$2" ai="center">
              <Button
                size="$3"
                variant="outlined"
                icon={Footprints}
                borderRadius="$10"
                bw={1}
                backgroundColor="$background"
                borderColor={theme.magenta7.val}
                color={theme.magenta7.val}
              >
                99999 KM walked
              </Button>
              <Button
                size="$3" 
                variant="outlined"
                icon={Flame}
                borderRadius="$10"
                bw={1}
                backgroundColor="$background"
                borderColor={theme.cyan8.val}
                color={theme.cyan8.val}
              >
                {(profile?.totalSteps * 0.04).toFixed(2)}Cal burned!
              </Button>
            </XStack>
          </ScrollView>
        </XStack>

        {/* Centered Avatar */}
        <XStack>
        <YStack ai="center" space="$4">
          <Avatar circular size="$10" backgroundColor={theme.cyan10.val}>
            <Avatar.Image
              source={selectedAvatar.url}
              resizeMode="contain"
            />
            <Avatar.Fallback backgroundColor={theme.cyan10.val} />
          </Avatar>
          <Button
            size="$2"
            borderRadius="$10"
            backgroundColor="$background"
            color={theme.color.val}
            onPress={() => setIsAvatarModalOpen(true)}
          >
            Edit Avatar
          </Button>
        </YStack>

        <YStack space="$2">
          <Text color="$color" fontSize="$3">
            {profile?.city && `📍 ${profile.city}`}
          </Text>
          {profile?.age && (
            <Text color="$color" fontSize="$3">
              Age: {profile.age}
            </Text>
          )}
          {(profile?.height || profile?.weight) && (
            <Text color="$color" fontSize="$3">
              {profile.height && `Height: ${profile.height}cm`}{" "}
              {profile.weight && `Weight: ${profile.weight}kg`}
            </Text>
          )}
        </YStack>

        
        </XStack>

        {/* Points Section */}
        <YStack ai="center" jc="center">
          <Text color={theme.color11.val} fontSize="$3">
            Total steps:
          </Text>
          <Text color="$color" fontSize="$9" fontWeight="bold">
          {profile?.totalSteps || 0}
          </Text>
        </YStack>
      </YStack>
    </Card.Footer>
  </Card>

  {/* Avatar Selection Sheet */}
  <Sheet
    forceRemoveScrollEnabled={isAvatarModalOpen}
    modal={true}
    open={isAvatarModalOpen}
    onOpenChange={setIsAvatarModalOpen}
    snapPoints={[40]}
    dismissOnSnapToBottom={true}
    zIndex={100000}
    animation="medium"
  >
    <Sheet.Overlay 
      animation="lazy" 
      enterStyle={{ opacity: 0 }}
      exitStyle={{ opacity: 0 }}
    />
    <Sheet.Frame 
      backgroundColor="$background"
      padding="$4"
      space="$4"
    >
      <Sheet.Handle />
      <YStack space="$6">
        <XStack justifyContent="space-between" alignItems="center">
          <XStack space="$2" ai="center">
            <Text color="$color" fontSize="$6" fontWeight="bold">
              Choose Avatar
            </Text>
          </XStack>
          <Button
            size="$3"
            variant="outlined"
            icon={X}
            circular
            bw={1}
            backgroundColor="$background"
            borderColor={theme.color8.val}
            color={theme.color.val}
            onPress={() => setIsAvatarModalOpen(false)}
          />
        </XStack>
        
        <XStack flexWrap="wrap" gap="$6" jc="center" pb="$4">
          {avatarOptions.map((avatar) => (
            <Button
              key={avatar.id}
              size="$7"
              circular
              backgroundColor="$background"
              pressStyle={{ scale: 0.95 }}
              onPress={() => handleAvatarSelect(avatar)}
              animation="bouncy"
              scale={selectedAvatar.id === avatar.id ? 1.15 : 1}
              opacity={selectedAvatar.id === avatar.id ? 1 : 0.5}
              hoverStyle={{ 
                scale: selectedAvatar.id === avatar.id ? 1.15 : 1.05,
                opacity: 1 
              }}
            >
              <Avatar 
                circular 
                size="$7" 
                backgroundColor={theme.cyan10.val}
                animation="bouncy"
              >
                <Avatar.Image 
                  source={avatar.url}
                  resizeMode="contain"
                />
                <Avatar.Fallback backgroundColor={theme.cyan10.val} />
              </Avatar>
            </Button>
          ))}
        </XStack>
      </YStack>
    </Sheet.Frame>
  </Sheet>

  </>
  );
};

export default ProfileCard;
