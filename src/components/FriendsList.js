import { StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import {
  Card,
  ScrollView,
  XStack,
  YStack,
  Text,
  Avatar,
  Image,
  Button,
  Label,
  H6,
  useTheme,
  Spinner,
} from "tamagui";
import { Plus } from "@tamagui/lucide-icons";
import ActivityRings from "react-native-activity-rings";
import AddFriendButton from "./AddFriendButton";
import ChallengeButton from "./ChallengeButton";
import { useQuery } from "@tanstack/react-query";
import { getAllFriends } from "../api/Auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import the avatar options
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

const FriendsList = () => {
  const theme = useTheme();
  const [ringColors, setRingColors] = useState([]);
  const [friendAvatars, setFriendAvatars] = useState({});

  const {
    data: friendss,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["friends"],
    queryFn: getAllFriends,
  });

  useEffect(() => {
    if (theme) {
      setRingColors([
        {
          color: theme.cyan7.val,
          backgroundColor: theme.cyan10.val,
        },
      ]);
    }
  }, [theme]);

  // Load friend avatars from AsyncStorage
  useEffect(() => {
    const loadFriendAvatars = async () => {
      try {
        if (friendss && friendss.length > 0) {
          const avatarPromises = friendss.map(async (friend) => {
            const savedAvatarId = await AsyncStorage.getItem(`userAvatarId_${friend.id}`);
            return {
              friendId: friend.id,
              avatarId: savedAvatarId ? parseInt(savedAvatarId) : 1 // Default to first avatar if none set
            };
          });

          const avatarResults = await Promise.all(avatarPromises);
          const avatarMap = {};
          avatarResults.forEach(({ friendId, avatarId }) => {
            avatarMap[friendId] = avatarOptions.find(a => a.id === avatarId) || avatarOptions[0];
          });
          setFriendAvatars(avatarMap);
        }
      } catch (error) {
        console.log('Error loading friend avatars:', error);
      }
    };

    loadFriendAvatars();
  }, [friendss]);

  const friendActivityRingConfig = {
    width: "90",
    height: "90",
    ringSize: 4,
    radius: 28,
    padAngle: 0,
    cornerRadius: 5,
    startAngle: 0,
    animationDuration: 1000,
    animated: true,
  };

  const getActivityRingColor = (index) => {
    return ringColors[index % ringColors.length] || ringColors[0];
  };

  if (!theme || ringColors.length === 0) return null;

  const renderFriendAvatar = (friend) => {
    const avatar = friendAvatars[friend.id] || avatarOptions[0];
    
    return (
      <YStack key={friend.id} ai="center">
        <XStack height="$6" ai="center" jc="center">
          <Avatar circular size="$5" zIndex={1}>
            <Avatar.Image
              source={avatar.url}
              resizeMode="contain"
              zIndex={1}
            />
            <Avatar.Fallback backgroundColor={theme.cyan10.val} />
          </Avatar>
          <YStack
            zIndex={2}
            position="absolute"
            left="50%"
            top="50%"
            transform={[{ translateX: -45 }, { translateY: -45 }]}
          >
            <ActivityRings
              data={[
                {
                  value: friend.totalSteps
                    ? friend.totalSteps / 10000
                    : 0,
                  ...getActivityRingColor(0),
                },
              ]}
              config={friendActivityRingConfig}
            />
          </YStack>
        </XStack>
        <Text fontSize="$2" mt="$1">
          {friend.username}
        </Text>
        {friend.city && (
          <Text fontSize="$1" color="$gray10">
            {friend.city}
          </Text>
        )}
      </YStack>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <YStack f={1} ai="center" jc="center" p="$4">
          <Spinner size="large" color={theme.color.val} />
        </YStack>
      );
    }

    if (error) {
      return (
        <YStack f={1} ai="center" jc="center" p="$4">
          <Text color={theme.color.val}>Error loading friends</Text>
          <Text color={theme.magenta9.val} fontSize="$2">{error.message}</Text>
        </YStack>
      );
    }

    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <XStack>
          <AddFriendButton />
          <ChallengeButton friends={friendss} />
          {friendss && friendss.length > 0 ? (
            friendss.map(renderFriendAvatar)
          ) : (
            <YStack ai="center" jc="center" p="$4">
              <Text color="$color">No friends found</Text>
              <Text color="$color" fontSize="$2" mt="$2">Add friends to get started!</Text>
            </YStack>
          )}
        </XStack>
      </ScrollView>
    );
  };

  return (
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
        <H6>Friends</H6>
      </Card.Header>
      <Card.Footer padded pt="$0">
        {renderContent()}
      </Card.Footer>
    </Card>
  );
};

export default FriendsList;
