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
import AsyncStorage from "@react-native-async-storage/async-storage";

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

  // Assign random avatars to friends
  useEffect(() => {
    if (friendss && friendss.length > 0) {
      const newAvatarMap = {};
      friendss.forEach(friend => {
        const randomAvatar = avatarOptions[Math.floor(Math.random() * avatarOptions.length)];
        newAvatarMap[friend.id] = randomAvatar;
      });
      setFriendAvatars(newAvatarMap);
    }
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
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{alignItems: "center", justifyContent: "center"}}>
          <XStack gap="$5" ai="center" justifyContent="center" height="$9">

            {/* Add and Challenge Buttons  */}
            <AddFriendButton />
            <ChallengeButton friends={friendss} />

            {/* Friend Avatars */}
            {isLoading ? (
              <Text>Loading...</Text>
            ) : error ? (
              <Text>Error loading friends</Text>
            ) : friendss && friendss.length > 0 ? (
              friendss.map((friend) => (
                <YStack key={friend.id} ai="center" gap="$1">
                  <XStack>
                    <Avatar size="$5" zIndex={1} br={40}>
                      <Avatar.Image
                        source={friendAvatars[friend.id]?.url || avatarOptions[0].url}
                        zIndex={1}
                      />
                      <Avatar.Fallback backgroundColor="$cyan10" />
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
                  <Text fontSize="$1" mt="$1">
                    {friend.username}
                  </Text>
                </YStack>
              ))
            ) : (
              <Text>No friends found</Text>
            )}
          </XStack>
        </ScrollView>
      </Card.Footer>
    </Card>
  );
};

export default FriendsList;
