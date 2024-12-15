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
} from "tamagui";
import { Plus } from "@tamagui/lucide-icons";
import ActivityRings from "react-native-activity-rings";

const FriendsList = () => {
  const theme = useTheme();
  const [ringColors, setRingColors] = useState([]);

  useEffect(() => {
    if (theme) {
      setRingColors([
        {
          color: theme.cyan7.val,
          backgroundColor: theme.cyan10.val,
        },
        // {
        //   color: theme.magenta7.val,
        //   backgroundColor: theme.magenta10.val,
        // },
        // {
        //   color: theme.lime7.val,
        //   backgroundColor: theme.lime10.val,
        // },
      ]);
    }
  }, [theme]);

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

  const friends = [
    {
      id: 1,
      name: "Sarah Chen",
      avatar: "https://github.com/hello-world.png",
      progress: 0.8,
      colorIndex: 0,
    },
    {
      id: 2,
      name: "Mike Johnson",
      avatar: "https://github.com/hello-world.png",
      progress: 0.6,
      colorIndex: 1,
    },
    {
      id: 3,
      name: "Emma Wilson",
      avatar: "https://github.com/hello-world.png",
      progress: 0.4,
      colorIndex: 2,
    },
    {
      id: 4,
      name: "James Smith",
      avatar: "https://github.com/hello-world.png",
      progress: 0.7,
      colorIndex: 0,
    },
    {
      id: 5,
      name: "Alex Brown",
      avatar: "https://github.com/hello-world.png",
      progress: 0.3,
      colorIndex: 1,
    },
    {
      id: 6,
      name: "Lisa Wang",
      avatar: "https://github.com/hello-world.png",
      progress: 0.5,
      colorIndex: 2,
    },
  ];

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
      <Card.Footer padded pt="0">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <XStack gap="$5" ai="center" jc="center">
            {/* Add Friend Avatar */}
            <YStack ai="center">
              <Avatar circular size="$5" borderWidth={1} borderColor="$color7">
                <Avatar.Fallback
                  backgroundColor="transparent"
                  jc="center"
                  ai="center"
                >
                  <Plus size={24} color="$color" />
                </Avatar.Fallback>
              </Avatar>
            </YStack>

            {/* Friend Avatars */}
            {friends.map((friend) => (
              <YStack key={friend.id} ai="center">
                <XStack height="$6" ai="center" jc="center">
                  <Avatar circular size="$5" zIndex={1}>
                    <Avatar.Image source={{ uri: friend.avatar }} zIndex={1} />
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
                          value: friend.progress,
                          ...getActivityRingColor(friend.colorIndex),
                        },
                      ]}
                      config={friendActivityRingConfig}
                    />
                  </YStack>
                </XStack>
              </YStack>
            ))}
          </XStack>
        </ScrollView>
      </Card.Footer>
    </Card>
  );
};

export default FriendsList;
