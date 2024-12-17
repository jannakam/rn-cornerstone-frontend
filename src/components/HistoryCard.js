import React, { useState } from 'react';
import { Card, YStack, XStack, Text, Button, Tabs, Separator, SizableText, useTheme, Spinner } from 'tamagui';
import { ChevronDown } from '@tamagui/lucide-icons';
import { ScrollView } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getAllDailyChallenges, getAllFriendChallenges, getAllEventChallenges } from '../api/Auth';

const HistoryCard = () => {
  const theme = useTheme();

  const { 
    data: dailyChallenges = [], 
    isLoading: isDailyLoading 
  } = useQuery({
    queryKey: ['dailyChallenges'],
    queryFn: getAllDailyChallenges
  });

  const { 
    data: friendChallenges = [], 
    isLoading: isFriendLoading 
  } = useQuery({
    queryKey: ['friendChallenges'],
    queryFn: getAllFriendChallenges
  });

  const { 
    data: eventChallenges = [], 
    isLoading: isEventLoading 
  } = useQuery({
    queryKey: ['eventChallenges'],
    queryFn: getAllEventChallenges
  });

  const renderContent = (data = [], isLoading = false) => {
    if (isLoading) {
      return (
        <YStack flex={1} alignItems="center" justifyContent="center">
          <Spinner size="large" />
        </YStack>
      );
    }

    return (
      <ScrollView>
        <YStack space="$2" padding="$2">
          {data.slice(0, 2).map((item) => (
            <Card key={item.id} bordered>
              <Card.Header padding="$3">
                <YStack space="$2">
                  <XStack justifyContent="space-between" alignItems="center">
                    <Text fontSize={16} fontWeight="bold">
                      {item.name || item.locationName || 'Daily Challenge'}
                    </Text>
                    <Text fontSize={16} fontWeight="bold">
                      {item.fixedPoints ? `+${item.fixedPoints}` : `+${Math.floor(item.stepGoal / 20)}`}
                    </Text>
                  </XStack>
                  <Text fontSize={12}>
                    {new Date(item.date || item.dateTime).toLocaleDateString()}
                  </Text>
                  <Text fontSize={14}>
                    {item.startTime && item.endTime 
                      ? `${item.startTime} - ${item.endTime}`
                      : `Goal: ${item.stepGoal} steps`}
                  </Text>
                </YStack>
              </Card.Header>
            </Card>
          ))}
        </YStack>
      </ScrollView>
    );
  };

  return (
    <Card bordered flex={1}>
      <Card.Header padding="$4">
        <XStack justifyContent="space-between" alignItems="center">
          <Text fontSize={24} fontWeight="bold">
            History
          </Text>
        </XStack>
      </Card.Header>

      <Card.Footer flex={1} paddingTop="$0">
        <Tabs
          defaultValue="daily"
          orientation="horizontal"
          flexDirection="column"
          width="100%"
          flex={1}
        >
          <Tabs.List backgroundColor="$background">
            <Tabs.Tab flex={1} value="daily">
              <Text>Daily</Text>
            </Tabs.Tab>
            <Tabs.Tab flex={1} value="events">
              <Text>Events</Text>
            </Tabs.Tab>
            <Tabs.Tab flex={1} value="challenges">
              <Text>Friends</Text>
            </Tabs.Tab>
          </Tabs.List>

          <Separator />

          <Tabs.Content value="daily" flex={1}>
            {renderContent(dailyChallenges, isDailyLoading)}
          </Tabs.Content>

          <Tabs.Content value="events" flex={1}>
            {renderContent(eventChallenges, isEventLoading)}
          </Tabs.Content>

          <Tabs.Content value="challenges" flex={1}>
            {renderContent(friendChallenges, isFriendLoading)}
          </Tabs.Content>
        </Tabs>
      </Card.Footer>
    </Card>
  );
};

export default HistoryCard;
