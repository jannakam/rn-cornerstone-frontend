import React from "react";
import {
  Card,
  YStack,
  XStack,
  Text,
  Avatar,
  Button,
  useTheme,
  Spinner,
} from "tamagui";
import { History } from "@tamagui/lucide-icons";
import { useNavigation } from "@react-navigation/native";
import { Platform } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../api/Auth";

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
    <Card
      elevate
      bordered
      animation="bouncy"
      backgroundColor="$background"
      padding="$4"
      width="100%"
    >
      <YStack space="$4">
        {/* Name at top left */}
        <Text color="$color" fontSize="$6" fontWeight="bold">
          {profile?.username || "Loading..."}
        </Text>

        {/* Centered Avatar */}
        <XStack
          justifyContent="center"
          alignItems="center"
          paddingVertical="$4"
        >
          <Avatar circular size="$10" backgroundColor="$gray6">
            <Avatar.Image
              source={{ uri: "https://github.com/hello-world.png" }}
            />
            <Avatar.Fallback backgroundColor="$gray6" />
          </Avatar>
        </XStack>

        {/* Profile Details */}
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

        {/* Points Section */}
        <YStack space="$2">
          <Text color="$lime10" fontSize="$3">
            Total points:
          </Text>
          <XStack space="$2" alignItems="baseline">
            <Text color="$color" fontSize="$9" fontWeight="bold">
              {profile?.totalSteps || 0}
            </Text>
            <Text color="$green10" fontSize="$3">
              {(profile?.totalSteps * 0.04).toFixed(2)} Kcal burned!
            </Text>
          </XStack>
          <Text color="$green10" fontSize="$3">
            {((profile?.totalSteps || 0) * 0.0008).toFixed(2)} KM walked
          </Text>
        </YStack>

        {/* Buttons */}
        <XStack space="$4">
          <Button
            flex={1}
            backgroundColor="$green8"
            color="$color"
            size="$4"
            hoverStyle={{ backgroundColor: "$green9" }}
            pressStyle={{ scale: 0.95 }}
            animation="bouncy"
            onPress={navigateToStore}
          >
            Redeem
          </Button>
        </XStack>
      </YStack>
    </Card>
  );
};

export default ProfileCard;
