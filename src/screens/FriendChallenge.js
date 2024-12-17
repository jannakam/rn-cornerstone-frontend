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
import { updateStepsForFriendChallenge } from '../api/Auth';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const BAR_WIDTH = SCREEN_WIDTH * 0.15; // Individual bar width
const AVATAR_SIZE = 50;

const FriendChallenge = ({ route, navigation }) => {
  const theme = useTheme();
  const { 
    activeChallenge, 
    challengeSteps,
    baseSteps,
    elapsedTime,
    updateSteps,
    setInitialSteps,
    updateTime,
    updateProgress, 
    endChallenge 
  } = useChallenge();
  
  const [participantsProgress, setParticipantsProgress] = useState({});
  const [isPedometerAvailable, setIsPedometerAvailable] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const timerRef = useRef(null);
  const pedometerSubscription = useRef(null);

  useEffect(() => {
    if (activeChallenge && activeChallenge.participants) {
      // Initialize progress for all participants
      const initialProgress = {
        user: 0,
        ...Object.fromEntries(
          activeChallenge.participants.map(p => [p.id, 0])
        )
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
    if (!pedometerSubscription.current && activeChallenge) {
      subscribe();
    }
    
    // Update steps in the backend every 30 seconds
    const updateInterval = setInterval(async () => {
      if (challengeSteps > 0 && activeChallenge?.id) {
        try {
          await updateStepsForFriendChallenge(activeChallenge.id, challengeSteps);
        } catch (error) {
          console.error('Error updating steps:', error);
        }
      }
    }, 30000);

    return () => {
      if (updateInterval) {
        clearInterval(updateInterval);
      }
    };
  }, [activeChallenge]);

  const startTimer = () => {
    // Clear any existing timer first
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    timerRef.current = setInterval(() => {
      updateTime(prev => prev + 1);
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
      justifyContent: 'space-evenly', // This ensures even spacing
    };
  };

  const checkGoalReached = async (steps, participantProgress) => {
    if (steps >= activeChallenge.targetSteps) {
      await handleChallengeComplete(true);
      return true;
    }

    // Check other participants
    for (const [participantId, participantSteps] of Object.entries(participantProgress)) {
      if (participantSteps >= activeChallenge.targetSteps) {
        await handleChallengeComplete(true);
        return true;
      }
    }
    return false;
  };

  const handleChallengeComplete = async (goalReached = false) => {
    try {
      // Stop timer and pedometer first
      stopTimer();
      
      if (pedometerSubscription.current) {
        pedometerSubscription.current.remove();
        pedometerSubscription.current = null;
      }
      
      // Make final steps update and mark challenge as completed
      if (activeChallenge?.id) {
        // Sort participants by steps to determine ranking
        const sortedParticipants = [
          { id: 'user', steps: challengeSteps },
          ...activeChallenge.participants.map(p => ({
            id: p.id,
            steps: participantsProgress[p.id] || 0
          }))
        ].sort((a, b) => b.steps - a.steps);

        // Find user's rank
        const userRank = sortedParticipants.findIndex(p => p.id === 'user') + 1;
        
        // Calculate points based on rank and goal completion
        const points = calculatePoints(userRank, goalReached);
        
        // Create challenge result
        const challengeResult = {
          id: activeChallenge.id,
          date: new Date().toISOString().split("T")[0],
          title: "Friend Challenge",
          points: points,
          description: `${getRankText(userRank)} Place - ${challengeSteps}/${activeChallenge.targetSteps} steps with ${activeChallenge.participants.map(p => p.username).join(", ")}`,
          completed: true,
          goalReached: goalReached
        };

        // Update backend with final state
        await updateStepsForFriendChallenge(
          activeChallenge.id, 
          challengeSteps,
          true, // completed
          goalReached
        );

        // End challenge in context and navigate to profile
        endChallenge();
        navigation.navigate("Profile", { 
          newChallenge: challengeResult,
          challengeSteps: challengeSteps
        });
      }
    } catch (error) {
      console.error('Error ending challenge:', error);
      Alert.alert(
        'Error',
        'Failed to end challenge. Please try again.',
        [{ text: 'OK' }]
      );
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
          
          const newParticipantsProgress = {
            ...participantsProgress,
            user: newSteps
          };

          // Simulate other participants' steps (for demo)
          if (activeChallenge?.participants) {
            activeChallenge.participants.forEach(participant => {
              // Ensure simulated steps never decrease
              const currentSteps = participantsProgress[participant.id] || 0;
              const simulatedSteps = Math.max(
                currentSteps,
                Math.floor(newSteps * (0.5 + Math.random() * 0.5)) // Random between 50-100% of user's steps
              );
              newParticipantsProgress[participant.id] = simulatedSteps;
              updateProgress(participant.id, simulatedSteps);
            });
          }

          setParticipantsProgress(newParticipantsProgress);
          updateProgress("user", newSteps);

          // Check if anyone has reached the goal
          checkGoalReached(newSteps, newParticipantsProgress);
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
    if (!activeChallenge) return "0%";
    return `${Math.min((steps / activeChallenge.targetSteps) * 100, 100)}%`;
  };

  const handleEndChallenge = () => {
    Alert.alert(
      "End Challenge",
      "Are you sure you want to end this challenge? This will mark it as incomplete.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "End",
          style: "destructive",
          onPress: () => handleChallengeComplete(false) // Explicitly mark as not reaching goal
        }
      ]
    );
  };

  const handleLeaderboardClose = () => {
    // Sort participants by steps to determine ranking
    const sortedParticipants = [
      { id: 'user', steps: challengeSteps },
      ...activeChallenge.participants.map(p => ({
        id: p.id,
        steps: participantsProgress[p.id] || 0
      }))
    ].sort((a, b) => b.steps - a.steps);

    // Find user's rank
    const userRank = sortedParticipants.findIndex(p => p.id === 'user') + 1;
    const goalReached = challengeSteps >= activeChallenge.targetSteps;
    
    const challengeResult = {
      id: activeChallenge.id,
      date: new Date().toISOString().split("T")[0],
      title: "Friend Challenge",
      points: calculatePoints(userRank, goalReached), // Points based on rank and completion
      description: activeChallenge?.participants?.length > 0 
        ? `${getRankText(userRank)} Place - ${challengeSteps}/${activeChallenge.targetSteps} steps with ${activeChallenge.participants.map(p => p.username).join(", ")}`
        : "Friend Challenge",
      completed: true,
      goalReached: goalReached
    };

    endChallenge();
    navigation.navigate("Profile", { 
      newChallenge: challengeResult,
      challengeSteps: challengeSteps
    });
  };

  // Helper function to calculate points based on rank and completion
  const calculatePoints = (rank, goalReached) => {
    let points = 0;
    
    // Base points for participation
    points += 100;
    
    // Points for reaching goal
    if (goalReached) {
      points += 200;
    }
    
    // Additional points based on rank
    switch(rank) {
      case 1: points += 200; break;
      case 2: points += 100; break;
      case 3: points += 50; break;
    }
    
    return `+${points}`;
  };

  // Helper function to get rank text
  const getRankText = (rank) => {
    switch(rank) {
      case 1: return '1st';
      case 2: return '2nd';
      case 3: return '3rd';
      default: return `${rank}th`;
    }
  };

  if (!activeChallenge || !activeChallenge.participants) {
    return (
      <DrawerSceneWrapper>
        <YStack f={1} bg="$background" padding="$4">
          <Header navigation={navigation} />
          <YStack f={1} ai="center" jc="center">
          <Text color="white" fontSize="$6" textAlign="center">
            No active challenge...{"\n"}Start a challenge from your friends list!
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
        steps: participantsProgress.user || 0,
        isLocalImage: true,
      },
      ...(activeChallenge.participants || []).map(participant => ({
        id: participant.id,
        name: participant.username,
        avatar: participant.avatar,
        steps: participantsProgress[participant.id] || 0,
        isLocalImage: false,
      })),
    ];

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
              <View style={[styles.barContainer, { borderColor: theme.cyan8.val }]}>
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
                <Avatar.Image source={require("../../assets/avatars/avatar1.png")} />
                <Avatar.Fallback backgroundColor={theme.cyan10.val} />
              </Avatar>
              <Text color="white" fontSize="$3" mt="$2">
                You
              </Text>
            </YStack>

            {/* Friend Progress Bars */}
            {(activeChallenge.participants || []).map((participant, index) => (
              <YStack key={participant.id} width={BAR_WIDTH} height="100%" ai="center">
                <View
                  style={[
                    styles.barContainer,
                    { borderColor: theme.cyan8.val }
                  ]}
                >
                  <View
                    style={[
                      styles.progressFill,
                      {
                        height: getProgressHeight(participantsProgress[participant.id] || 0),
                        backgroundColor: theme.cyan8.val
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
