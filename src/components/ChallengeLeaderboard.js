import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { YStack, XStack, Text, Avatar, useTheme, Button } from 'tamagui';
import { ChevronLeft, Crown } from '@tamagui/lucide-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BAR_WIDTH = SCREEN_WIDTH * 0.7;

const ChallengeLeaderboard = ({ participants, targetSteps, onClose }) => {
  const theme = useTheme();
  
  // Sort participants by steps in descending order and add rank
  const sortedParticipants = participants
    .sort((a, b) => b.steps - a.steps)
    .map((participant, index) => ({
      ...participant,
      rank: index + 1
    }));
  
  const getBarWidth = (steps) => {
    const percentage = Math.min((steps / targetSteps) * 100, 100);
    return `${percentage}%`;
  };

  const getBarColor = (rank) => {
    const colors = [theme.cyan8.val, theme.lime8.val, theme.purple8.val, theme.magenta8.val];
    return colors[rank - 1] || colors[0];
  };

  const getRankText = (rank) => {
    switch(rank) {
      case 1: return '1st';
      case 2: return '2nd';
      case 3: return '3rd';
      default: return `${rank}th`;
    }
  };

  const calculateDistance = (steps) => {
    // Approximate distance calculation (steps * average step length in km)
    return (steps * 0.0007).toFixed(2);
  };

  return (
    <YStack f={1} bg="black" padding="$4" space="$4" jc="center">
      {/* Back Button */}
      <ChevronLeft 
        position="absolute" 
        top="$11" 
        left="$8" 
        size={20} 
        color={theme.color.val} 
        onPress={onClose} 
      />

      {/* Leaderboard Content */}
      <YStack space="$8" width={BAR_WIDTH} alignSelf="center">
        {/* Winner Announcement */}
        <YStack ai="center" space="$2">
          <Crown size={40} color={getBarColor(1)} />
          <Text color="$color" fontSize="$4" textAlign="center">
            CHALLENGE COMPLETE
          </Text>
          <Text color={getBarColor(1)} fontSize="$7" fontWeight="bold">
            {sortedParticipants[0].name.toUpperCase()}
          </Text>
          <Text color={theme.color11.val} fontSize="$4">
            {getRankText(1)} Place
          </Text>
        </YStack>

        {/* Leaderboard Bars */}
        <YStack space="$4">
          {sortedParticipants.map((participant) => (
            <XStack key={participant.id} space="$3" ai="center">
              <Text color={getBarColor(participant.rank)} fontSize="$4" fontWeight="bold" width={40}>
                {getRankText(participant.rank)}
              </Text>
              <Avatar 
                size="$4" 
                br={40}
              >
                <Avatar.Image 
                  source={participant.isLocalImage ? participant.avatar : { uri: participant.avatar }}
                />
                <Avatar.Fallback backgroundColor={getBarColor(participant.rank)} />
              </Avatar>
              <YStack f={1}>
                <XStack jc="space-between" mb="$1">
                  <Text color="$color" fontSize="$3" fontWeight="bold">
                    {participant.name}
                  </Text>
                  <Text color={getBarColor(participant.rank)} fontSize="$3" fontWeight="bold">
                    {participant.steps.toLocaleString()} steps
                  </Text>
                </XStack>
                <View style={styles.barBackground}>
                  <View 
                    style={[
                      styles.barFill,
                      {
                        width: getBarWidth(participant.steps),
                        backgroundColor: getBarColor(participant.rank)
                      }
                    ]} 
                  />
                </View>
              </YStack>
            </XStack>
          ))}
        </YStack>

        {/* Stats */}
        <XStack jc="space-between" mx="$4">
          <YStack ai="center" space="$1">
            <Text color="$color" fontSize="$6" fontWeight="bold">
              {sortedParticipants[0].steps.toLocaleString()}
            </Text>
            <Text color="$color" fontSize="$3" o={0.7}>
              steps
            </Text>
          </YStack>
          <YStack ai="center" space="$1">
            <Text color="$color" fontSize="$6" fontWeight="bold">
              {calculateDistance(sortedParticipants[0].steps)}
            </Text>
            <Text color="$color" fontSize="$3" o={0.7}>
              km
            </Text>
          </YStack>
        </XStack>
      </YStack>
    </YStack>
  );
};

const styles = StyleSheet.create({
  barBackground: {
    width: '100%',
    height: 12,
    backgroundColor: '#333',
    borderRadius: 6,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 6,
  },
});

export default ChallengeLeaderboard; 