import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Dimensions, Animated, View, Alert } from 'react-native';
import { YStack, XStack, Text, Card, useTheme, Avatar, Button } from 'tamagui';
import { ChevronLeft, X } from '@tamagui/lucide-icons';
import DrawerSceneWrapper from '../components/DrawerSceneWrapper';
import Header from '../components/Header';
import { Pedometer } from 'expo-sensors';
import { useNavigation } from '@react-navigation/native';
import { useChallenge } from '../context/ChallengeContext';
import ChallengeLeaderboard from '../components/ChallengeLeaderboard';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BAR_WIDTH = SCREEN_WIDTH * 0.15;
const AVATAR_SIZE = 50;

const FriendChallenge = ({ route, navigation }) => {
  const theme = useTheme();
  const { activeChallenge, updateProgress, endChallenge } = useChallenge();
  const [mySteps, setMySteps] = useState(0);
  const [friendSteps, setFriendSteps] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPedometerAvailable, setIsPedometerAvailable] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const timerRef = useRef(null);
  const pedometerSubscription = useRef(null);

  useEffect(() => {
    if (activeChallenge) {
      setMySteps(0);
      setFriendSteps(0);
      setElapsedTime(0);
      setShowLeaderboard(false);
      subscribe();
      startTimer();
    }
    return () => {
      unsubscribe();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [activeChallenge]);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const subscribe = async () => {
    try {
      const isAvailable = await Pedometer.isAvailableAsync();
      setIsPedometerAvailable(isAvailable);

      if (isAvailable) {
        // Start counting steps from when the challenge begins
        const start = new Date();
        let baseSteps = 0;

        // Get initial step count
        const { steps: initialSteps } = await Pedometer.getStepCountAsync(
          new Date(start.getTime() - 1000), // 1 second before
          start
        );
        baseSteps = initialSteps;

        // Watch for new steps
        pedometerSubscription.current = Pedometer.watchStepCount(result => {
          const currentSteps = result.steps - baseSteps;
          setMySteps(currentSteps);
          updateProgress('user', currentSteps);
          
          // Simulate friend's steps for demo (80% of user's steps)
          const simulatedFriendSteps = Math.floor(currentSteps * 0.8);
          setFriendSteps(simulatedFriendSteps);
          updateProgress('friend', simulatedFriendSteps);
        });
      }
    } catch (error) {
      console.log('Failed to subscribe to pedometer:', error);
    }
  };

  const unsubscribe = () => {
    if (pedometerSubscription.current) {
      pedometerSubscription.current.remove();
      pedometerSubscription.current = null;
    }
  };

  const getProgressHeight = (steps) => {
    if (!activeChallenge) return '0%';
    return `${Math.min((steps / activeChallenge.targetSteps) * 100, 100)}%`;
  };

  const handleEndChallenge = () => {
    Alert.alert(
      "End Challenge",
      "Are you sure you want to end this challenge?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "End",
          style: "destructive",
          onPress: () => {
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            unsubscribe();
            setShowLeaderboard(true);
          }
        }
      ]
    );
  };

  const handleLeaderboardClose = () => {
    const challengeResult = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      title: 'Friend Challenge',
      points: '+300',
      description: `Challenge with ${activeChallenge.friend.name}`,
    };

    endChallenge();
    navigation.navigate('Profile', { newChallenge: challengeResult });
  };

  if (!activeChallenge) {
    return (
      <DrawerSceneWrapper>
        <YStack f={1} bg="black" padding="$4" ai="center" jc="center">
          <Header navigation={navigation} />
          <Text color="white" fontSize="$6" textAlign="center">
            No active challenge.{'\n'}Start a challenge from the friends list!
          </Text>
        </YStack>
      </DrawerSceneWrapper>
    );
  }

  if (showLeaderboard) {
    const participants = [
      {
        id: 'user',
        name: 'SALIM',
        avatar: require('../../assets/avatars/avatar1.png'),
        steps: mySteps,
        isLocalImage: true
      },
      {
        id: activeChallenge.friend.id,
        name: activeChallenge.friend.name,
        avatar: activeChallenge.friend.avatar,
        steps: friendSteps,
        isLocalImage: false
      }
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
        
        <YStack f={1} ai="center" jc="center" space="$4">
          {/* Progress Bars Container */}
          <XStack height={SCREEN_HEIGHT * 0.55} space={BAR_WIDTH} ai="flex-end">
            {/* My Progress Bar */}
            <YStack width={BAR_WIDTH} height="100%" ai="center">
              <View style={[styles.barContainer, { borderColor: theme.cyan8.val }]}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      height: getProgressHeight(mySteps),
                      backgroundColor: theme.cyan8.val 
                    }
                  ]} 
                />
              </View>
              <Avatar 
                circular 
                size="$4"
                style={styles.avatar}
              >
                <Avatar.Image source={require('../../assets/avatars/avatar1.png')} />
                <Avatar.Fallback backgroundColor={theme.cyan10.val} />
              </Avatar>
              <Text color="white" fontSize="$3" mt="$2">
                SALIM
              </Text>
            </YStack>

            {/* Friend Progress Bar */}
            <YStack width={BAR_WIDTH} height="100%" ai="center">
              <View style={[styles.barContainer, { borderColor: theme.magenta8.val }]}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      height: getProgressHeight(friendSteps),
                      backgroundColor: theme.magenta8.val 
                    }
                  ]} 
                />
              </View>
              <Avatar 
                circular 
                size="$4"
                style={styles.avatar}
              >
                <Avatar.Image source={{ uri: activeChallenge.friend.avatar }} />
                <Avatar.Fallback backgroundColor={theme.magenta10.val} />
              </Avatar>
              <Text color="white" fontSize="$3" mt="$2">
                {activeChallenge.friend.name.toUpperCase()}
              </Text>
            </YStack>
          </XStack>

          {/* Timer and Steps */}
          <YStack ai="center" space="$2" mt="$4">
            <Text color="white" fontSize="$9" fontWeight="bold">
              {formatTime(elapsedTime)}
            </Text>
            <Text color="white" fontSize="$5">
              {mySteps}/{activeChallenge.targetSteps} steps
            </Text>
          </YStack>
        </YStack>
      </YStack>
    </DrawerSceneWrapper>
  );
};

const styles = StyleSheet.create({
  barContainer: {
    width: '100%',
    height: '100%',
    borderWidth: 2,
    borderRadius: 60,
    overflow: 'hidden',
    backgroundColor: '#333',
  },
  progressFill: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    borderRadius: 20,
  },
  avatar: {
    position: 'absolute',
    zIndex: 10,
    bottom: 5,
  },
});

export default FriendChallenge; 