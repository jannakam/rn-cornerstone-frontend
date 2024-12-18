import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Dimensions, Animated, View, Alert } from "react-native";
import { YStack, XStack, Text, Card, useTheme, Avatar, Button } from "tamagui";
import { ChevronLeft, X } from "@tamagui/lucide-icons";
import DrawerSceneWrapper from "../components/DrawerSceneWrapper";
import Header from "../components/Header";
import { Pedometer } from "expo-sensors";
import { useNavigation } from "@react-navigation/native";
import { useChallenge } from "../context/ChallengeContext";
import ChallengeLeaderboard from "../components/ChallengeLeaderboard";
import {
  updateStepsForFriendChallenge,
  getUserProfile,
  updateUser,
  getChallengeStatus,
} from "../api/Auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const BAR_WIDTH = SCREEN_WIDTH * 0.15; // Individual bar width
const AVATAR_SIZE = 50;
const STEP_UPDATE_THRESHOLD = 5; // Update backend every 5 steps
const CHALLENGE_POLL_INTERVAL = 5000; // Poll every 5 seconds

const FriendChallenge = ({ route, navigation }) => {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const {
    activeChallenge,
    challengeSteps,
    baseSteps,
    elapsedTime,
    updateSteps,
    setInitialSteps,
    updateTime,
    updateProgress,
    endChallenge,
  } = useChallenge();

  const [participantsProgress, setParticipantsProgress] = useState({});
  const [isPedometerAvailable, setIsPedometerAvailable] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const timerRef = useRef(null);
  const pedometerSubscription = useRef(null);
  const lastUpdatedSteps = useRef(0);

  // Query for fetching challenge status
  const { data: challengeStatus } = useQuery({
    queryKey: ["challengeStatus", activeChallenge?.id],
    queryFn: async () => {
      if (!activeChallenge?.id) {
        throw new Error("No active challenge ID");
      }
      const data = await getChallengeStatus(activeChallenge.id);
      return data;
    },
    enabled: !!activeChallenge?.id && !isCompleting,
    refetchInterval: CHALLENGE_POLL_INTERVAL,
    onSuccess: (data) => {
      // Update participants progress with the latest data
      if (data?.participants) {
        const newProgress = {
          user: challengeSteps, // Keep local step count for current user
          ...Object.fromEntries(
            data.participants
              .filter((p) => p.id !== "user") // Exclude current user's server data
              .map((p) => [p.id, p.steps])
          ),
        };
        setParticipantsProgress(newProgress);

        // Update progress in challenge context for each participant
        data.participants
          .filter((p) => p.id !== "user") // Only update other participants
          .forEach((p) => {
            updateProgress(p.id, p.steps);
          });
      }
    },
    onError: (error) => {
      console.error("Error fetching challenge status:", error);
      // Only show alert for network errors or server errors
      if (!error.message.includes("No active challenge ID")) {
        Alert.alert(
          "Error",
          "Failed to fetch challenge progress. Please try again later.",
          [{ text: "OK" }]
        );
      }
    },
  });

  // Mutation for updating steps
  const updateStepsMutation = useMutation({
    mutationFn: async ({ challengeId, steps, completed, goalReached }) => {
      // First get the current user's challenge status
      const currentProfile = await getUserProfile();
      const userChallenge = currentProfile.challenges?.find(
        (c) => c.friendChallengeId === challengeId
      );

      if (!userChallenge) {
        throw new Error("Challenge not found for user");
      }

      // Update steps for this specific challenge
      return updateStepsForFriendChallenge(
        challengeId,
        steps,
        completed,
        goalReached
      );
    },
    onSuccess: () => {
      // Invalidate and refetch challenge status after step update
      queryClient.invalidateQueries(["challengeStatus", activeChallenge?.id]);
    },
    onError: (error) => {
      console.error("Error updating steps:", error);
      Alert.alert("Error", "Failed to update steps. Please try again.", [
        { text: "OK" },
      ]);
    },
  });

  // Mutation for updating user profile
  const updateProfileMutation = useMutation({
    mutationFn: (data) => updateUser(data),
  });

  useEffect(() => {
    if (activeChallenge && activeChallenge.participants) {
      // Initialize progress for all participants with null to indicate no steps yet
      const initialProgress = {
        user: 0,
        ...Object.fromEntries(
          activeChallenge.participants.map((p) => [p.id, null])
        ),
      };
      setParticipantsProgress(initialProgress);

      // Start timer if not already running
      if (!timerRef.current) {
        startTimer();
      }
    }
  }, [activeChallenge]);

  // Cleanup only when component is unmounted
  useEffect(() => {
    return () => {
      // Don't cleanup pedometer when just leaving the page
      // Timer cleanup is handled in its own effect
    };
  }, []);

  // Separate timer effect
  useEffect(() => {
    // Only start timer if there's an active challenge and timer isn't running
    if (activeChallenge && !timerRef.current) {
      startTimer();
    }

    // Cleanup timer when component unmounts or challenge ends
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [activeChallenge]); // Only re-run if activeChallenge changes

  // Add new effect to handle pedometer setup
  useEffect(() => {
    // Start pedometer if not already running
    if (!pedometerSubscription.current && activeChallenge && !isCompleting) {
      subscribe();
    }

    return () => {
      if (pedometerSubscription.current) {
        pedometerSubscription.current.remove();
        pedometerSubscription.current = null;
      }
    };
  }, [activeChallenge, isCompleting]);

  // Effect to handle step updates to backend
  useEffect(() => {
    if (challengeSteps > 0 && activeChallenge?.id && !isCompleting) {
      // Only update if we've accumulated enough new steps
      const stepDifference = challengeSteps - lastUpdatedSteps.current;
      if (stepDifference >= STEP_UPDATE_THRESHOLD) {
        updateStepsMutation.mutate({
          challengeId: activeChallenge.id,
          steps: challengeSteps,
          completed: false,
          goalReached: false,
        });
        lastUpdatedSteps.current = challengeSteps;
      }
    }
  }, [challengeSteps, activeChallenge?.id, isCompleting]);

  const startTimer = () => {
    // Clear any existing timer first
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

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

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getFlexStyle = () => {
    const totalParticipants = (activeChallenge?.participants?.length || 0) + 1; // +1 for user

    return {
      width: SCREEN_WIDTH * 0.9, // Container takes 90% of screen width
      justifyContent: "space-evenly", // This ensures even spacing
    };
  };

  const checkGoalReached = async (steps, participantProgress) => {
    if (steps >= activeChallenge.targetSteps) {
      await handleChallengeComplete(true);
      return true;
    }

    // Check other participants
    for (const [participantId, participantSteps] of Object.entries(
      participantProgress
    )) {
      if (participantSteps >= activeChallenge.targetSteps) {
        await handleChallengeComplete(true);
        return true;
      }
    }
    return false;
  };

  const handleChallengeComplete = async (goalReached = false) => {
    if (isCompleting) return; // Prevent multiple completions

    try {
      setIsCompleting(true);

      // Stop timer and pedometer first
      stopTimer();
      if (pedometerSubscription.current) {
        pedometerSubscription.current.remove();
        pedometerSubscription.current = null;
      }

      // Make final steps update and mark challenge as completed
      if (activeChallenge?.id) {
        try {
          // Get current user profile to verify challenge relationship
          const currentProfile = await getUserProfile();
          const userChallenge = currentProfile.challenges?.find(
            (c) => c.friendChallengeId === activeChallenge.id
          );

          if (!userChallenge) {
            throw new Error("Challenge not found for user");
          }

          // Update backend with final state
          await updateStepsMutation.mutateAsync({
            challengeId: activeChallenge.id,
            steps: challengeSteps,
            completed: true,
            goalReached,
          });

          // Calculate new total steps
          const currentTotalSteps = parseInt(currentProfile.totalSteps) || 0;
          const newTotalSteps = currentTotalSteps + challengeSteps;

          await updateProfileMutation.mutateAsync({
            totalSteps: newTotalSteps,
          });

          console.log("Updated total steps:", {
            previousTotal: currentTotalSteps,
            challengeSteps: challengeSteps,
            newTotal: newTotalSteps,
          });

          // Show leaderboard
          setShowLeaderboard(true);
        } catch (error) {
          if (error.message?.includes("already completed")) {
            // If challenge is already completed, just show leaderboard
            setShowLeaderboard(true);
          } else {
            throw error; // Re-throw other errors
          }
        }
      }
    } catch (error) {
      console.error("Error ending challenge:", error);
      Alert.alert("Error", "Failed to end challenge. Please try again.", [
        { text: "OK" },
      ]);
      setIsCompleting(false); // Reset completion flag on error
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
          const newSteps = Math.max(result.steps - baseSteps, 0); // Prevent negative steps
          updateSteps(newSteps);

          // Only update if we have new steps
          if (newSteps > 0) {
            const newParticipantsProgress = {
              ...participantsProgress,
              user: newSteps,
            };

            // Simulate other participants' steps (for demo)
            if (activeChallenge?.participants) {
              activeChallenge.participants.forEach((participant) => {
                // Only update if we haven't set steps yet or if we have new steps
                const currentSteps = participantsProgress[participant.id];
                if (
                  currentSteps === null ||
                  newSteps > participantsProgress.user
                ) {
                  const simulatedSteps = Math.floor(
                    newSteps * (0.5 + Math.random() * 0.5)
                  );
                  newParticipantsProgress[participant.id] = simulatedSteps;
                  updateProgress(participant.id, simulatedSteps);
                } else {
                  // Keep existing steps
                  newParticipantsProgress[participant.id] = currentSteps;
                }
              });
            }

            setParticipantsProgress(newParticipantsProgress);
            updateProgress("user", newSteps);

            // Check if anyone has reached the goal
            checkGoalReached(newSteps, newParticipantsProgress);
          }
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

  const getProgressHeight = (steps) => {
    if (!activeChallenge || steps === null) return "0%";
    return `${Math.min((steps / activeChallenge.targetSteps) * 100, 100)}%`;
  };

  const handleEndChallenge = () => {
    if (isCompleting) return; // Prevent multiple endings

    Alert.alert(
      "End Challenge",
      "Are you sure you want to end this challenge? Your current steps will be recorded but the challenge will be marked as incomplete.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "End",
          style: "destructive",
          onPress: async () => {
            try {
              setIsCompleting(true);

              // Stop timer and pedometer first
              stopTimer();
              if (pedometerSubscription.current) {
                pedometerSubscription.current.remove();
                pedometerSubscription.current = null;
              }

              // Update backend before showing leaderboard
              if (activeChallenge?.id) {
                try {
                  await updateStepsMutation.mutateAsync({
                    challengeId: activeChallenge.id,
                    steps: challengeSteps,
                    completed: true,
                    goalReached: false,
                  });

                  // Get current user profile and update total steps
                  const currentProfile = await getUserProfile();
                  const currentTotalSteps =
                    parseInt(currentProfile.totalSteps) || 0;
                  const newTotalSteps = currentTotalSteps + challengeSteps;

                  await updateProfileMutation.mutateAsync({
                    totalSteps: newTotalSteps,
                  });

                  console.log("Updated total steps:", {
                    previousTotal: currentTotalSteps,
                    challengeSteps: challengeSteps,
                    newTotal: newTotalSteps,
                  });

                  // Show leaderboard
                  setShowLeaderboard(true);
                } catch (error) {
                  if (error.message?.includes("already completed")) {
                    // If challenge is already completed, just show leaderboard
                    setShowLeaderboard(true);
                  } else {
                    throw error; // Re-throw other errors
                  }
                }
              }
            } catch (error) {
              console.error("Error ending challenge:", error);
              Alert.alert(
                "Error",
                "Failed to end challenge. Please try again.",
                [{ text: "OK" }]
              );
              setIsCompleting(false); // Reset completion flag on error
            }
          },
        },
      ]
    );
  };

  const handleLeaderboardClose = async () => {
    try {
      // End challenge in context
      endChallenge();
      // Reset completion flag
      setIsCompleting(false);
      // Simply navigate back to profile
      navigation.navigate("Profile");
    } catch (error) {
      console.error("Error ending challenge:", error);
      Alert.alert("Error", "Failed to end challenge. Please try again.", [
        { text: "OK" },
      ]);
    }
  };

  if (!activeChallenge || !activeChallenge.participants) {
    return (
      <DrawerSceneWrapper>
        <YStack f={1} bg="$background" padding="$4">
          <Header navigation={navigation} />
          <YStack f={1} ai="center" jc="center">
            <Text color="white" fontSize="$6" textAlign="center">
              No active challenge...{"\n"}Start a challenge from your friends
              list!
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
        steps: challengeSteps || 0,
        isLocalImage: true,
        goalReached: (challengeSteps || 0) >= activeChallenge.targetSteps,
      },
      ...(activeChallenge.participants || []).map((participant) => ({
        id: participant.id,
        name: participant.username,
        avatar: participant.avatar,
        steps: participantsProgress[participant.id] || 0,
        isLocalImage: false,
        goalReached:
          (participantsProgress[participant.id] || 0) >=
          activeChallenge.targetSteps,
      })),
    ].sort((a, b) => b.steps - a.steps);

    return (
      <DrawerSceneWrapper>
        <ChallengeLeaderboard
          participants={participants}
          targetSteps={activeChallenge.targetSteps}
          onClose={handleLeaderboardClose}
          showGoalStatus={true}
        />
      </DrawerSceneWrapper>
    );
  }

  return (
    <DrawerSceneWrapper>
      <YStack f={1} bg="black" padding="$4">
        <Header navigation={navigation} />

        {/* Navigation Buttons */}
        <XStack jc="space-between" ai="center" mt="$2">
          <ChevronLeft
            size="$2"
            onPress={() => navigation.goBack()}
            backgroundColor="transparent"
            color="white"
            p="$2"
            ml="$3"
          />
          <Button
            size="$4"
            onPress={handleEndChallenge}
            backgroundColor={theme.background.val}
            borderColor={theme.color6.val}
            color="white"
            borderRadius="$9"
            mr="$2"
          >
            End
          </Button>
        </XStack>

        <YStack f={1} ai="center" jc="center" space="$6">
          {/* Progress Bars Container */}
          <XStack
            {...getFlexStyle()}
            height={SCREEN_HEIGHT * 0.53}
            ai="flex-end"
            alignSelf="center"
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
                />
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

            {/* Friend Progress Bars */}
            {(activeChallenge.participants || []).map((participant, index) => (
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
                        height: getProgressHeight(
                          participantsProgress[participant.id] || 0
                        ),
                        backgroundColor: theme.cyan8.val,
                      },
                    ]}
                  />
                </View>
                <Avatar circular size="$4" style={styles.avatar}>
                  <Avatar.Image source={{ uri: participant.avatar }} />
                  <Avatar.Fallback backgroundColor={theme.cyan10.val} />
                </Avatar>
                <Text color="white" fontSize="$3" mt="$2">
                  {participant.username?.toUpperCase()}
                </Text>
              </YStack>
            ))}
          </XStack>

          {/* Timer and Steps */}
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
});

export default FriendChallenge;
