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
  Card,
} from "tamagui";
import {
  ChevronDown,
  ChevronUp,
  Check,
  Play,
  Trophy,
  Plus,
  Users,
} from "@tamagui/lucide-icons";
import { useNavigation } from "@react-navigation/native";
import { useChallenge } from "../context/ChallengeContext";
import {
  createFriendChallenge,
  participateInFriendChallenge,
  getAllFriendChallenges,
  getAllFriends,
} from "../api/Auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

const ChallengeButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [challengeSteps, setChallengeSteps] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [friendAvatars, setFriendAvatars] = useState({});
  const [showCreateChallenge, setShowCreateChallenge] = useState(false);
  const navigation = useNavigation();
  const theme = useTheme();
  const queryClient = useQueryClient();
  const { activeChallenge, startChallenge } = useChallenge();

  // Fetch active challenges using useQuery
  const {
    data: activeChallenges,
    isLoading: isLoadingChallenges,
    error: challengesError,
  } = useQuery({
    queryKey: ["activeChallenges"],
    queryFn: getAllFriendChallenges,
    refetchInterval: 2000, // Poll every 2 seconds
  });

  // Fetch friends using useQuery
  const {
    data: friends,
    isLoading: isLoadingFriends,
    error: friendsError,
  } = useQuery({
    queryKey: ["friends"],
    queryFn: getAllFriends,
  });

  // Create challenge mutation
  const createChallengeMutation = useMutation({
    mutationFn: (challengeData) => createFriendChallenge(challengeData),
    onSuccess: () => {
      queryClient.invalidateQueries(["activeChallenges"]);
    },
  });

  // Participate mutation
  const participateMutation = useMutation({
    mutationFn: ({ challengeId, friendIds }) =>
      participateInFriendChallenge(challengeId, friendIds),
    onSuccess: () => {
      queryClient.invalidateQueries(["activeChallenges"]);
    },
  });

  // Load friend avatars from AsyncStorage
  React.useEffect(() => {
    const loadFriendAvatars = async () => {
      if (friends && friends.length > 0) {
        const newAvatarMap = {};
        for (const friend of friends) {
          const savedAvatarId = await AsyncStorage.getItem(
            `friendAvatar_${friend.id}`
          );
          if (savedAvatarId) {
            const avatar = avatarOptions.find(
              (a) => a.id === parseInt(savedAvatarId)
            );
            if (avatar) {
              newAvatarMap[friend.id] = avatar;
            }
          }
        }
        setFriendAvatars(newAvatarMap);
      }
    };

    loadFriendAvatars();
  }, [friends]);

  const handleCreateChallenge = async () => {
    if (!challengeSteps || !selectedFriends.length) return;

    try {
      setIsLoading(true);

      // Create the challenge with all selected friends
      const challengeData = await createChallengeMutation.mutateAsync({
        stepGoal: Number(challengeSteps),
        friendIds: selectedFriends,
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        date: new Date().toISOString().split("T")[0],
      });

      // Participate in the challenge
      await participateMutation.mutateAsync({
        challengeId: challengeData.id,
        friendIds: selectedFriends,
      });

      // Get all selected friends' data and their avatars
      const selectedFriendsData = selectedFriends
        .map((friendId) => {
          const friend = friends.find((f) => f.id === friendId);
          const avatar = friendAvatars[friendId]?.url || avatarOptions[0].url;
          return friend
            ? {
                id: friend.id,
                username: friend.username,
                avatar: avatar,
                steps: 0,
              }
            : null;
        })
        .filter(Boolean);

      // Start the challenge locally with all participants
      await startChallenge({
        id: challengeData.id,
        targetSteps: Number(challengeSteps),
        participants: selectedFriendsData,
        startTime: challengeData.startTime,
        endTime: challengeData.endTime,
        date: challengeData.date,
      });

      setShowCreateChallenge(false);
      setIsOpen(false);
      navigation.navigate("Friend Challenge");
    } catch (error) {
      console.error("Error creating challenge:", error);
      Alert.alert("Error", "Failed to create challenge. Please try again.", [
        { text: "OK" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinChallenge = async (challenge) => {
    try {
      setIsLoading(true);

      // Participate in the challenge
      await participateMutation.mutateAsync({
        challengeId: challenge.id,
        friendIds: [], // No need to specify friends when joining
      });

      // Start the challenge locally
      await startChallenge({
        id: challenge.id,
        targetSteps: challenge.stepGoal,
        participants: challenge.participants || [],
        startTime: challenge.startTime,
        endTime: challenge.endTime,
        date: challenge.date,
      });

      setIsOpen(false);
      navigation.navigate("Friend Challenge");
    } catch (error) {
      console.error("Error joining challenge:", error);
      Alert.alert("Error", "Failed to join challenge. Please try again.", [
        { text: "OK" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (activeChallenge) {
    return (
      <YStack ai="center" jc="center">
        <Avatar
          size="$5"
          borderWidth={2}
          borderColor={theme.cyan8.val}
          onPress={() => navigation.navigate("Friend Challenge")}
          circular
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
                icon={<Play color="$color" size={16} />}
                backgroundColor={theme.cyan8.val}
                circular
                size="$5"
                onPress={() => navigation.navigate("Friend Challenge")}
              ></Button>
            </YStack>
          </Avatar.Fallback>
        </Avatar>

        <Button unstyled fontSize="$1" mt="$1" color="$color">
          Continue
        </Button>
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
        ></Button>

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
        <Sheet.Frame padding="$4">
          <Sheet.Handle />
          <YStack space="$4">
            <XStack jc="space-between" ai="center">
              <Text fontSize="$6" fontWeight="bold">
                Friend Challenges
              </Text>
              <Button
                size="$3"
                icon={<Plus />}
                circular
                onPress={() => setShowCreateChallenge(true)}
              />
            </XStack>

            {isLoadingChallenges ? (
              <YStack ai="center" jc="center" p="$4">
                <Spinner size="large" color="$color" />
              </YStack>
            ) : challengesError ? (
              <Text color="$red10" p="$4">
                Error loading challenges
              </Text>
            ) : activeChallenges?.length > 0 ? (
              <ScrollView>
                <YStack space="$3">
                  {activeChallenges
                    .filter((challenge) => !challenge.completed)
                    .map((challenge) => (
                      <Card
                        key={challenge.id}
                        bordered
                        animation="bouncy"
                        scale={0.9}
                        hoverStyle={{ scale: 0.925 }}
                        pressStyle={{ scale: 0.925 }}
                        onPress={() => handleJoinChallenge(challenge)}
                      >
                        <Card.Header padded>
                          <YStack space="$2">
                            <XStack jc="space-between" ai="center">
                              <Text fontSize="$5" fontWeight="bold">
                                {challenge.stepGoal} Steps Challenge
                              </Text>
                              <XStack space="$2" ai="center">
                                <Users size={16} />
                                <Text>
                                  {(challenge.participants || []).length + 1}/5
                                </Text>
                              </XStack>
                            </XStack>
                            <Text fontSize="$3" opacity={0.7}>
                              Created by {challenge.creator?.username || "Unknown"}
                            </Text>
                          </YStack>
                        </Card.Header>
                        <Card.Footer padded>
                          <XStack space="$2" flexWrap="wrap">
                            {challenge.participants?.map((participant) => (
                              <Avatar
                                key={participant.id}
                                circular
                                size="$3"
                                borderWidth={2}
                                borderColor="$color"
                              >
                                <Avatar.Image
                                  source={
                                    friendAvatars[participant.id]?.url ||
                                    avatarOptions[0].url
                                  }
                                />
                                <Avatar.Fallback backgroundColor="$blue10" />
                              </Avatar>
                            ))}
                          </XStack>
                        </Card.Footer>
                      </Card>
                    ))}
                </YStack>
              </ScrollView>
            ) : (
              <Text p="$4" textAlign="center">
                No active challenges found
              </Text>
            )}
          </YStack>
        </Sheet.Frame>
      </Sheet>

      {/* Create Challenge Sheet */}
      <Sheet
        modal
        open={showCreateChallenge}
        onOpenChange={setShowCreateChallenge}
        snapPoints={[85]}
        position={0}
        dismissOnSnapToBottom
      >
        <Sheet.Overlay />
        <Sheet.Frame padding="$4">
          <Sheet.Handle />
          <YStack space="$4">
            <Text fontSize="$6" fontWeight="bold">
              Create Challenge
            </Text>

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
                      {[10, 50, 100, 1000, 5000, 10000, 15000, 20000, 25000].map(
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
                          source={
                            friendAvatars[friend.id]?.url || avatarOptions[0].url
                          }
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
                isLoading
                  ? () => <Spinner size="small" color={theme.color.val} />
                  : undefined
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
