import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Dimensions, Animated, View, Alert } from "react-native";
import { YStack, XStack, Text, Card, useTheme, Avatar, Button } from "tamagui";
import { ChevronLeft } from "@tamagui/lucide-icons";
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
const STEP_UPDATE_INTERVAL = 2000; // Update backend every 2 seconds
const CHALLENGE_POLL_INTERVAL = 2000; // Poll every 2 seconds

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
  const [isEndingChallenge, setIsEndingChallenge] = useState(false);
  const timerRef = useRef(null);
  const pedometerSubscription = useRef(null);

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
    enabled: !!activeChallenge?.id && !isCompleting,
    refetchInterval: CHALLENGE_POLL_INTERVAL,
    onSuccess: (data) => {
      if (data?.participants) {
        // Use server data as source of truth
        const newProgress = Object.fromEntries(
          data.participants.map((p) => [p.id, p.steps])
        );
        setParticipantsProgress(newProgress);

        data.participants.forEach((p) => {
          updateProgress(p.id, p.steps);
        });

        // Update local steps from server if needed
        if (newProgress['user'] != null) {
          updateSteps(newProgress['user']);
        }

        // Check if anyone has reached the goal
        checkGoalReached(newProgress['user'] || challengeSteps, newProgress);
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

  // Mutation for updating steps
  const updateStepsMutation = useMutation({
    mutationFn: async ({ challengeId, steps, completed = false, goalReached = false }) => {
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
        if (typeof steps !== 'number' || steps < 0) {
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
    onError: (error) => {
      console.error("Error updating steps:", error);
      // Only show alert for non-network errors
      if (!error.message.includes("Network Error")) {
        Alert.alert("Error", "Failed to update steps. Please try again.", [
          { text: "OK" },
        ]);
      }
    },
  });

  // Mutation for updating user profile
  const updateProfileMutation = useMutation({
    mutationFn: (data) => updateUser(data),
  });

  useEffect(() => {
    if (activeChallenge && activeChallenge.participants) {
      // Initialize progress with null for all participants
      const initialProgress = {
        ...Object.fromEntries(
          activeChallenge.participants.map((p) => [p.id, null])
        ),
        user: 0,
      };
      setParticipantsProgress(initialProgress);

      if (!timerRef.current) {
        startTimer();
      }
    }
  }, [activeChallenge]);

  useEffect(() => {
    return () => {
      // Cleanup if needed
    };
  }, []);

  useEffect(() => {
    if (activeChallenge && !timerRef.current) {
      startTimer();
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [activeChallenge]);

  useEffect(() => {
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

  useEffect(() => {
    let updateInterval;
    if (activeChallenge?.id && !isCompleting) {
      updateInterval = setInterval(() => {
        if (challengeSteps > 0) {
          try {
            updateStepsMutation.mutate({
              challengeId: activeChallenge.id,
              steps: Math.round(challengeSteps), // Ensure steps is an integer
              completed: false,
              goalReached: false,
            });
          } catch (error) {
            console.error("Error in step update interval:", error);
          }
        }
      }, STEP_UPDATE_INTERVAL);
    }

    return () => {
      if (updateInterval) {
        clearInterval(updateInterval);
      }
    };
  }, [challengeSteps, activeChallenge?.id, isCompleting]);

  const startTimer = () => {
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
      width: SCREEN_WIDTH * 0.9,
      justifyContent: "space-evenly",
    };
  };

  const checkGoalReached = async (userSteps, participantProgress) => {
    if (userSteps >= activeChallenge.targetSteps) {
      await handleChallengeComplete(true, true);
      return true;
    }

    for (const [participantId, participantSteps] of Object.entries(
      participantProgress
    )) {
      if (
        participantId !== "user" &&
        participantSteps >= activeChallenge.targetSteps
      ) {
        await handleChallengeComplete(false, false);
        return true;
      }
    }
    return false;
  };

  const handleChallengeComplete = async (
    goalReached = false,
    firstToComplete = false
  ) => {
    if (isCompleting) return;

    try {
      setIsCompleting(true);
      setIsEndingChallenge(true);

      stopTimer();
      if (pedometerSubscription.current) {
        pedometerSubscription.current.remove();
        pedometerSubscription.current = null;
      }

      setShowLeaderboard(true);

      if (activeChallenge?.id) {
        try {
          // Get current user profile first
          const currentProfile = await getUserProfile();
          const currentTotalSteps = parseInt(currentProfile.totalSteps) || 0;
          const currentPoints = parseInt(currentProfile.points) || 0;

          // Get user's steps from the challenge progress
          const userSteps = participantsProgress['user'] || challengeSteps || 0;

          // Calculate new totals using only the user's steps
          const newTotalSteps = currentTotalSteps + userSteps;
          const newPoints = currentPoints + (firstToComplete ? 100 : 0);

          // Update both challenge and profile simultaneously
          await Promise.all([
            updateStepsMutation.mutateAsync({
              challengeId: activeChallenge.id,
              steps: userSteps,
              completed: true,
              goalReached,
              firstToComplete,
            }),
            updateProfileMutation.mutateAsync({
              totalSteps: newTotalSteps,
              points: newPoints,
            }),
          ]);

          // Invalidate queries to refresh data
          queryClient.invalidateQueries(["userProfile"]);
          queryClient.invalidateQueries(["challengeStatus", activeChallenge.id]);
        } catch (error) {
          console.error("Error updating final challenge state:", error);
          throw error;
        }
      }
    } catch (error) {
      console.error("Error ending challenge:", error);
      Alert.alert("Error", "Failed to end challenge. Please try again.", [
        { text: "OK" },
      ]);
      setIsCompleting(false);
    } finally {
      setIsEndingChallenge(false);
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
          setParticipantsProgress((prev) => ({ ...prev, user: newSteps }));
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
    if (!activeChallenge || steps === null || steps === undefined) return "0%";
    return `${Math.min((steps / activeChallenge.targetSteps) * 100, 100)}%`;
  };

  const handleEndChallenge = () => {
    if (isCompleting) return;

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
              setIsEndingChallenge(true);
              setShowLeaderboard(true);
              stopTimer();
              if (pedometerSubscription.current) {
                pedometerSubscription.current.remove();
                pedometerSubscription.current = null;
              }

              if (activeChallenge?.id) {
                try {
                  // Get current user profile first
                  const currentProfile = await getUserProfile();
                  const currentTotalSteps = parseInt(currentProfile.totalSteps) || 0;
                  const currentPoints = parseInt(currentProfile.points) || 0;

                  // Get user's steps from the challenge progress
                  const userSteps = participantsProgress['user'] || challengeSteps || 0;

                  // Calculate new totals using only the user's steps
                  const newTotalSteps = currentTotalSteps + userSteps;

                  // Update both challenge and profile simultaneously
                  await Promise.all([
                    updateStepsMutation.mutateAsync({
                      challengeId: activeChallenge.id,
                      steps: userSteps,
                      completed: true,
                      goalReached: false,
                      firstToComplete: false,
                    }),
                    updateProfileMutation.mutateAsync({
                      totalSteps: newTotalSteps,
                      points: currentPoints, // Keep points the same since challenge wasn't completed
                    }),
                  ]);

                  // Invalidate queries to refresh data
                  queryClient.invalidateQueries(["userProfile"]);
                  queryClient.invalidateQueries(["challengeStatus", activeChallenge.id]);
                } catch (error) {
                  console.error("Error updating final state:", error);
                  throw error;
                }
              }
            } catch (error) {
              console.error("Error ending challenge:", error);
              Alert.alert("Error", "Failed to end challenge. Please try again.", [
                { text: "OK" },
              ]);
            } finally {
              setIsEndingChallenge(false);
            }
          },
        },
      ]
    );
  };

  const handleLeaderboardClose = async () => {
    try {
      endChallenge();
      setIsCompleting(false);
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
        steps: participantsProgress['user'] || challengeSteps || 0,
        isLocalImage: true,
        goalReached:
          (participantsProgress['user'] || challengeSteps || 0) >=
          activeChallenge.targetSteps,
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
          isLoading={isEndingChallenge}
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
        </XStack>

        <YStack f={1} ai="center" jc="center" space="$6">
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
                      height: getProgressHeight(
                        participantsProgress['user'] || challengeSteps || 0
                      ),
                      backgroundColor: theme.cyan8.val,
                    },
                  ]}
                >
                  <Text style={styles.stepCount} color="white">
                    {participantsProgress['user'] || challengeSteps || 0}
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
            {(activeChallenge?.participants || []).map((participant) => (
              <YStack key={participant.id} width={BAR_WIDTH} height="100%" ai="center">
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
                  >
                    <Text style={styles.stepCount} color="white">
                      {participantsProgress[participant.id] || 0}
                    </Text>
                  </View>
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

          <YStack ai="center" space="$2" mt="$4">
            <Text color="white" fontSize="$9" fontWeight="bold">
              {formatTime(elapsedTime)}
            </Text>
            <Text color="white" fontSize="$5">
              {(participantsProgress['user'] != null
                ? participantsProgress['user']
                : challengeSteps) || 0}
              /{activeChallenge.targetSteps} steps
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
    position: 'absolute',
    top: 10,
    width: '100%',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default FriendChallenge;
