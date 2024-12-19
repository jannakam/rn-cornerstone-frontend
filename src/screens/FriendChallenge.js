import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Dimensions, View, Alert } from "react-native";
import { YStack, XStack, Text, useTheme, Avatar, Button } from "tamagui";
import { ChevronLeft } from "@tamagui/lucide-icons";
import DrawerSceneWrapper from "../components/DrawerSceneWrapper";
import Header from "../components/Header";
import { Pedometer } from "expo-sensors";
import { useNavigation } from "@react-navigation/native";
import { useChallenge } from "../context/ChallengeContext";
import ChallengeLeaderboard from "../components/ChallengeLeaderboard";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  updateStepsForFriendChallenge,
  getUserProfile,
  updateUser,
  getChallengeStatus,
} from "../api/Auth";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const BAR_WIDTH = SCREEN_WIDTH * 0.15;
const CHALLENGE_POLL_INTERVAL = 2000; // Poll every 2 seconds

const FriendChallenge = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const {
    activeChallenge,
    challengeSteps,
    baseSteps,
    elapsedTime,
    updateSteps,
    setInitialSteps,
    updateTime,
    endChallenge,
  } = useChallenge();

  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [isPedometerAvailable, setIsPedometerAvailable] = useState(false);
  const [isEndingChallenge, setIsEndingChallenge] = useState(false);
  const timerRef = useRef(null);
  const pedometerSubscription = useRef(null);

  // Update steps mutation
  const updateStepsMutation = useMutation({
    mutationFn: async ({
      challengeId,
      steps,
      completed = false,
      goalReached = false,
    }) => {
      try {
        // First get current profile to verify challenge exists
        const currentProfile = await getUserProfile();
        const userChallenge = currentProfile.challenges?.find(
          (c) => c.friendChallengeId === challengeId
        );

        if (!userChallenge) {
          throw new Error("Challenge not found for user");
        }

        // Add validation for steps
        if (typeof steps !== "number" || steps < 0) {
          throw new Error("Invalid step count");
        }

        // Send the update request with validated data
        return await updateStepsForFriendChallenge(
          challengeId,
          Math.round(steps), // Ensure steps is an integer
          completed,
          goalReached
        );
      } catch (error) {
        console.error("Error in updateStepsMutation:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["userProfile"]);
    },
  });

  // Mutation for updating user profile
  const updateProfileMutation = useMutation({
    mutationFn: (data) => updateUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["userProfile"]);
    },
  });

  // Query to fetch challenge status
  const { data: challengeStatus } = useQuery({
    queryKey: ["challengeStatus", activeChallenge?.id],
    queryFn: async () => {
      if (!activeChallenge?.id) {
        throw new Error("No active challenge ID");
      }
      const data = await getChallengeStatus(activeChallenge.id);
      return data;
    },
    enabled: !!activeChallenge?.id && !isEndingChallenge,
    refetchInterval: CHALLENGE_POLL_INTERVAL,
    onSuccess: (data) => {
      if (data?.completed) {
        handleChallengeComplete(false);
      }
    },
    onError: (error) => {
      console.error("Error fetching challenge status:", error);
      if (!error.message.includes("No active challenge ID")) {
        Alert.alert(
          "Error",
          "Failed to fetch challenge progress. Please try again later.",
          [{ text: "OK" }]
        );
      }
    },
  });

  // Start timer when component mounts
  useEffect(() => {
    if (activeChallenge && !timerRef.current) {
      startTimer();
    }
    return () => stopTimer();
  }, [activeChallenge]);

  // Start pedometer when component mounts
  useEffect(() => {
    if (activeChallenge) {
      subscribe();
    }
    return () => {
      if (pedometerSubscription.current) {
        pedometerSubscription.current.remove();
      }
    };
  }, [activeChallenge]);

  // Check if goal is reached
  useEffect(() => {
    if (activeChallenge && challengeSteps >= activeChallenge.targetSteps) {
      handleChallengeComplete(true);
    }
  }, [challengeSteps, activeChallenge]);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      updateTime((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const subscribe = async () => {
    try {
      const isAvailable = await Pedometer.isAvailableAsync();
      setIsPedometerAvailable(isAvailable);

      if (isAvailable) {
        const start = new Date();

        if (baseSteps === 0) {
          const { steps: initialSteps } = await Pedometer.getStepCountAsync(
            new Date(start.getTime() - 1000),
            start
          );
          setInitialSteps(initialSteps);
        }

        pedometerSubscription.current = Pedometer.watchStepCount((result) => {
          const newSteps = Math.max(result.steps - baseSteps, 0);
          updateSteps(newSteps);
        });
      }
    } catch (error) {
      console.log("Failed to subscribe to pedometer:", error);
      Alert.alert(
        "Pedometer Error",
        "Failed to access step counter. Please make sure you have granted the necessary permissions.",
        [{ text: "OK" }]
      );
    }
  };

  const handleChallengeComplete = async (goalReached) => {
    try {
      setIsEndingChallenge(true);
      stopTimer();
      if (pedometerSubscription.current) {
        pedometerSubscription.current.remove();
      }

      if (activeChallenge?.id) {
        // Get current user profile first
        const currentProfile = await getUserProfile();
        const currentTotalSteps = parseInt(currentProfile.totalSteps) || 0;
        const currentPoints = parseInt(currentProfile.points) || 0;

        // Calculate new totals
        const newTotalSteps = currentTotalSteps + challengeSteps;
        const newPoints = currentPoints + (goalReached ? 100 : 0);

        // Update challenge first with completed status
        await updateStepsMutation.mutateAsync({
          challengeId: activeChallenge.id,
          steps: challengeSteps,
          completed: true, // Always mark as completed when ending
          goalReached,
        });

        // Then update user profile
        await updateProfileMutation.mutateAsync({
          totalSteps: newTotalSteps,
          points: newPoints,
          // Also update the challenge status in the user profile
          challenges: currentProfile.challenges?.map(challenge => 
            challenge.friendChallengeId === activeChallenge.id 
              ? { ...challenge, completed: true }
              : challenge
          ) || [],
        });

        // Invalidate queries to refresh the data
        queryClient.invalidateQueries(["challengeStatus", activeChallenge.id]);
      }

      setShowLeaderboard(true);
    } catch (error) {
      console.error("Error completing challenge:", error);
      Alert.alert("Error", "Failed to complete challenge. Please try again.", [
        { text: "OK" },
      ]);
    } finally {
      setIsEndingChallenge(false);
    }
  };

  const handleEndChallenge = () => {
    Alert.alert(
      "End Challenge",
      "Are you sure you want to end this challenge?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "End",
          style: "destructive",
          onPress: () => handleChallengeComplete(false),
        },
      ]
    );
  };

  const handleLeaderboardClose = () => {
    endChallenge();
    navigation.navigate("Profile");
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getProgressHeight = (steps) => {
    if (!activeChallenge || !steps) return "0%";
    return `${Math.min((steps / activeChallenge.targetSteps) * 100, 100)}%`;
  };

  if (!activeChallenge || !activeChallenge.participants) {
    return (
      <DrawerSceneWrapper>
        <YStack f={1} bg="$background" padding="$4">
          <Header navigation={navigation} />
          <YStack f={1} ai="center" jc="center">
            <Text color="white" fontSize="$6" textAlign="center">
              No active challenge...
              {"\n"}Start a challenge from your friends list!
            </Text>
          </YStack>
        </YStack>
      </DrawerSceneWrapper>
    );
  }

  if (showLeaderboard) {
    const participants = [
      {
        id: "user",
        name: "You",
        avatar: require("../../assets/avatars/avatar1.png"),
        steps: challengeSteps,
        isLocalImage: true,
        goalReached: challengeSteps >= activeChallenge.targetSteps,
      },
      ...activeChallenge.participants.map((participant) => ({
        id: participant.id,
        name: participant.username,
        avatar: participant.avatar,
        steps: participant.steps || 0,
        isLocalImage: false,
        goalReached: false,
      })),
    ].sort((a, b) => b.steps - a.steps);

    return (
      <DrawerSceneWrapper>
        <ChallengeLeaderboard
          participants={participants}
          targetSteps={activeChallenge.targetSteps}
          onClose={handleLeaderboardClose}
        />
      </DrawerSceneWrapper>
    );
  }

  return (
    <DrawerSceneWrapper>
      <YStack f={1} bg="black" padding="$4">
        <Header navigation={navigation} />

        <XStack jc="space-between" ai="center" mt="$2">
          <ChevronLeft
            size="$2"
            onPress={() => navigation.goBack()}
            backgroundColor="transparent"
            color="white"
            p="$2"
            ml="$3"
          />
          {challengeStatus?.active ? (
            <Button
              size="$4"
              onPress={() => {}}
              backgroundColor={theme.background.val}
              borderColor={theme.color6.val}
              color="white"
              borderRadius="$9"
              mr="$2"
            >
              Continue
            </Button>
          ) : (
            <Button
              size="$4"
              onPress={handleEndChallenge}
              backgroundColor={theme.background.val}
              borderColor={theme.color6.val}
              color="white"
              borderRadius="$9"
              mr="$2"
              disabled={isEndingChallenge}
            >
              {isEndingChallenge ? "Ending..." : "End"}
            </Button>
          )}
        </XStack>

        <YStack f={1} ai="center" jc="center" space="$6">
          <XStack
            width={SCREEN_WIDTH * 0.9}
            height={SCREEN_HEIGHT * 0.53}
            ai="flex-end"
            jc="space-evenly"
          >
            {/* User Progress Bar */}
            <YStack width={BAR_WIDTH} height="100%" ai="center">
              <View
                style={[styles.barContainer, { borderColor: theme.cyan8.val }]}
              >
                <View
                  style={[
                    styles.progressFill,
                    {
                      height: getProgressHeight(challengeSteps),
                      backgroundColor: theme.cyan8.val,
                    },
                  ]}
                >
                  <Text style={styles.stepCount} color="white">
                    {challengeSteps}
                  </Text>
                </View>
              </View>
              <Avatar circular size="$4" style={styles.avatar}>
                <Avatar.Image
                  source={require("../../assets/avatars/avatar1.png")}
                />
                <Avatar.Fallback backgroundColor={theme.cyan10.val} />
              </Avatar>
              <Text color="white" fontSize="$3" mt="$2">
                You
              </Text>
            </YStack>

            {/* Other Participants */}
            {activeChallenge.participants.map((participant) => (
              <YStack
                key={participant.id}
                width={BAR_WIDTH}
                height="100%"
                ai="center"
              >
                <View
                  style={[
                    styles.barContainer,
                    { borderColor: theme.cyan8.val },
                  ]}
                >
                  <View
                    style={[
                      styles.progressFill,
                      {
                        height: getProgressHeight(participant.steps),
                        backgroundColor: theme.cyan8.val,
                      },
                    ]}
                  >
                    <Text style={styles.stepCount} color="white">
                      {participant.steps || 0}
                    </Text>
                  </View>
                </View>
                <Avatar circular size="$4" style={styles.avatar}>
                  <Avatar.Image source={{ uri: participant.avatar }} />
                  <Avatar.Fallback backgroundColor={theme.cyan10.val} />
                </Avatar>
                <Text color="white" fontSize="$3" mt="$2">
                  {participant.username}
                </Text>
              </YStack>
            ))}
          </XStack>

          <YStack ai="center" space="$2" mt="$4">
            <Text color="white" fontSize="$9" fontWeight="bold">
              {formatTime(elapsedTime)}
            </Text>
            <Text color="white" fontSize="$5">
              {challengeSteps}/{activeChallenge.targetSteps} steps
            </Text>
          </YStack>
        </YStack>
      </YStack>
    </DrawerSceneWrapper>
  );
};

const styles = StyleSheet.create({
  barContainer: {
    width: "100%",
    height: "100%",
    borderWidth: 2,
    borderRadius: 60,
    overflow: "hidden",
    backgroundColor: "#333",
  },
  progressFill: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    borderRadius: 60,
  },
  avatar: {
    position: "absolute",
    zIndex: 10,
    bottom: 5,
  },
  stepCount: {
    position: "absolute",
    top: 10,
    width: "100%",
    textAlign: "center",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default FriendChallenge;
