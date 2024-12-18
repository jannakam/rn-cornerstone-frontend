import React, { useState } from "react";
import {
  YStack,
  Avatar,
  Text,
  Sheet,
  Label,
  Select,
  Button,
  XStack,
  ScrollView,
  Checkbox,
  LinearGradient,
  Adapt,
  useTheme,
  Spinner,
  Alert,
} from "tamagui";
import { ChevronDown, ChevronUp, Check, Play, Trophy } from "@tamagui/lucide-icons";
import { useNavigation } from "@react-navigation/native";
import { useChallenge } from "../context/ChallengeContext";
import { createFriendChallenge, participateInFriendChallenge } from "../api/Auth";
import { useQuery } from "@tanstack/react-query";
import { getAllFriends } from "../api/Auth";

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

const ChallengeButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [challengeSteps, setChallengeSteps] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [friendAvatars, setFriendAvatars] = useState({});
  const navigation = useNavigation();
  const theme = useTheme();
  const { activeChallenge, startChallenge } = useChallenge();

  // Fetch friends using useQuery
  const {
    data: friends,
    isLoading: isLoadingFriends,
    error: friendsError,
  } = useQuery({
    queryKey: ["friends"],
    queryFn: getAllFriends,
  });

  // Assign random avatars to friends when they load
  React.useEffect(() => {
    if (friends && friends.length > 0) {
      const newAvatarMap = {};
      friends.forEach(friend => {
        const randomAvatar = avatarOptions[Math.floor(Math.random() * avatarOptions.length)];
        newAvatarMap[friend.id] = randomAvatar;
      });
      setFriendAvatars(newAvatarMap);
    }
  }, [friends]);

  const handleCreateChallenge = async () => {
    if (!challengeSteps || !selectedFriends.length) return;

    try {
      setIsLoading(true);

      // Create the challenge with all selected friends
      const challengeData = await createFriendChallenge({
        targetSteps: Number(challengeSteps),
        friendIds: selectedFriends
      });

      // Get all selected friends' data
      const selectedFriendsData = selectedFriends.map(friendId => 
        friends.find(f => f.id === friendId)
      ).filter(Boolean);

      // Start the challenge locally with all participants
      await startChallenge({
        id: challengeData.id,
        targetSteps: Number(challengeSteps),
        participants: selectedFriendsData.map(friend => ({
          id: friend.id,
          username: friend.username,
          avatar: friend.avatar || "https://github.com/hello-world.png",
          steps: 0
        }))
      });

      setIsOpen(false);
      navigation.navigate("Friend Challenge");
    } catch (error) {
      console.error("Error creating challenge:", error);
      Alert.alert(
        "Error",
        "Failed to create challenge. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (activeChallenge) {
    return (
      <YStack ai="center" space="$2">
        <Avatar
          size="$6"
          borderWidth={2}
          borderColor={theme.cyan8.val}
          onPress={() => navigation.navigate("Friend Challenge")}
          br={40}
        >
          <Avatar.Fallback
            backgroundColor={theme.cyan10.val}
            jc="center"
            ai="center"
          >
            <YStack ai="center" jc="center">
              <Button
                fontSize={8}
                color={theme.color.val}
                icon={Play}
                backgroundColor={theme.cyan8.val}
                circular
                size="$6"
                onPress={() => navigation.navigate("Friend Challenge")}
              ></Button>
            </YStack>
          </Avatar.Fallback>
        </Avatar>
      </YStack>
    );
  }

  return (
    <YStack ai="center">
      <YStack ai="center" jc="center">
      <Button
        circular
        size="$5"
        icon={<Trophy color="$color" size={16} />}
        borderWidth={1}
        borderColor="$color"
        onPress={() => !isLoading && setIsOpen(true)}
      >
      </Button>

      <Button unstyled fontSize="$1" mt="$1" color="$color">
            Challenge
        </Button>
      </YStack>

      <Sheet
        modal
        open={isOpen}
        onOpenChange={setIsOpen}
        snapPoints={[85]}
        position={0}
        dismissOnSnapToBottom
      >
        <Sheet.Overlay />
        <Sheet.Frame>
          <Sheet.Handle />
          <YStack padding="$4" space="$4">
            {/* Steps Selection */}
            <YStack space="$2">
              <Label fontSize={16} fontWeight="bold">
                Set Challenge Steps
              </Label>
              <Select
                value={String(challengeSteps)}
                onValueChange={(val) => setChallengeSteps(Number(val))}
                disablePreventBodyScroll
                disabled={isLoading}
              >
                <Select.Trigger
                  width="100%"
                  backgroundColor="$background"
                  borderColor="$color4"
                  padding="$3"
                  iconAfter={ChevronDown}
                >
                  <Select.Value
                    placeholder="Select target steps"
                    color="$color"
                    fontSize={16}
                  />
                </Select.Trigger>

                <Adapt when="sm" platform="touch">
                  <Sheet modal dismissOnSnapToBottom>
                    <Sheet.Frame>
                      <Sheet.ScrollView>
                        <Adapt.Contents />
                      </Sheet.ScrollView>
                    </Sheet.Frame>
                    <Sheet.Overlay
                      animation="lazy"
                      enterStyle={{ opacity: 0 }}
                      exitStyle={{ opacity: 0 }}
                    />
                  </Sheet>
                </Adapt>

                <Select.Content>
                  <Select.ScrollUpButton>
                    <ChevronUp size={20} />
                  </Select.ScrollUpButton>

                  <Select.Viewport>
                    <Select.Group>
                      {[100, 1000, 5000, 10000, 15000, 20000, 25000].map(
                        (steps, i) => (
                          <Select.Item
                            index={i}
                            key={steps}
                            value={String(steps)}
                          >
                            <Select.ItemText>
                              {steps.toLocaleString()} steps
                            </Select.ItemText>
                            <Select.ItemIndicator>
                              <Check size={16} />
                            </Select.ItemIndicator>
                          </Select.Item>
                        )
                      )}
                    </Select.Group>
                  </Select.Viewport>

                  <Select.ScrollDownButton>
                    <ChevronDown size={20} />
                  </Select.ScrollDownButton>
                </Select.Content>
              </Select>
            </YStack>

            {/* Friends Selection */}
            <YStack space="$2">
              <Text fontSize={14} fontWeight="600">
                Select up to 4 friends ({selectedFriends.length}/4)
              </Text>
              <ScrollView maxHeight={300}>
                {isLoadingFriends ? (
                  <XStack padding="$4" jc="center">
                    <Spinner size="large" color="$color" />
                  </XStack>
                ) : friendsError ? (
                  <Text color="$red10" padding="$4">
                    Error loading friends. Please try again.
                  </Text>
                ) : friends?.length > 0 ? (
                  friends.map((friend) => (
                    <XStack
                      key={friend.id}
                      space="$4"
                      padding="$3"
                      alignItems="center"
                      backgroundColor="$background"
                      borderRadius="$4"
                      marginVertical="$1"
                    >
                      <Checkbox
                        checked={selectedFriends.includes(friend.id)}
                        onCheckedChange={(checked) => {
                          if (!isLoading) {
                            setSelectedFriends((prev) => {
                              if (checked) {
                                if (prev.length >= 4) return prev;
                                return [...prev, friend.id];
                              } else {
                                return prev.filter((id) => id !== friend.id);
                              }
                            });
                          }
                        }}
                        disabled={
                          isLoading ||
                          (selectedFriends.length >= 4 &&
                            !selectedFriends.includes(friend.id))
                        }
                      >
                        <Checkbox.Indicator>
                          <Check />
                        </Checkbox.Indicator>
                      </Checkbox>

                      <Avatar size="$4" br={40}>
                        <Avatar.Image
                          source={friendAvatars[friend.id]?.url || avatarOptions[0].url}
                        />
                        <Avatar.Fallback backgroundColor="$blue10" />
                      </Avatar>

                      <YStack>
                        <Text fontSize={16} fontWeight="500">
                          {friend.username}
                        </Text>
                        {friend.city && (
                          <Text fontSize={12} color="$gray10">
                            {friend.city}
                          </Text>
                        )}
                      </YStack>
                    </XStack>
                  ))
                ) : (
                  <Text padding="$4">No friends found</Text>
                )}
              </ScrollView>
            </YStack>

            <Button
              onPress={handleCreateChallenge}
              theme="active"
              disabled={
                !challengeSteps || selectedFriends.length === 0 || isLoading
              }
              fontSize={14}
              backgroundColor={theme.background.val}
              borderColor={theme.color6.val}
              color={theme.color.val}
              icon={
                isLoading ? () => (
                  <Spinner size="small" color={theme.color.val} />
                ) : undefined
              }
            >
              {isLoading ? "Creating..." : "Create Challenge"}
            </Button>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </YStack>
  );
};

export default ChallengeButton;
