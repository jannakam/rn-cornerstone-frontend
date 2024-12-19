import React, { useState, useMemo } from "react";
import {
  Card,
  YStack,
  XStack,
  Text,
  Tabs,
  Separator,
  useTheme,
  Spinner,
} from "tamagui";
import { ScrollView } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../api/Auth";

const HistoryCard = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState("daily");

  const { data: userProfile, isLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
  });

  const organizedChallenges = useMemo(() => {
    if (!userProfile?.challenges) return { daily: [], events: [], friends: [] };

    return userProfile.challenges.reduce(
      (acc, challenge) => {
        if (challenge.dailyChallengeId) {
          acc.daily.push(challenge);
        } else if (challenge.eventId) {
          acc.events.push(challenge);
        } else if (challenge.friendChallengeId) {
          acc.friends.push(challenge);
        }
        return acc;
      },
      { daily: [], events: [], friends: [] }
    );
  }, [userProfile?.challenges]);

  const renderContent = (type = "daily") => {
    if (isLoading) {
      return (
        <YStack flex={1} alignItems="center" justifyContent="center">
          <Spinner size="large" />
        </YStack>
      );
    }

    const challenges = organizedChallenges[type] || [];

    return (
      <ScrollView>
        <YStack space="$2" padding="$2">
          {challenges.map((item) => (
            <Card
              key={
                item.dailyChallengeId || item.eventId || item.friendChallengeId
              }
              bordered
            >
              <Card.Header padding="$3">
                <YStack space="$2">
                  <XStack justifyContent="center" alignItems="center">
                    <Text fontSize={16} fontWeight="bold">
                      {type === "daily" && "Daily Challenge"}
                      {type === "events" && item.eventName}
                      {type === "friends" && item.friendChallengeName}
                    </Text>
                    <XStack space="$2" alignItems="center">
                      <Text
                        fontSize={14}
                        color={item.completed ? "$green10" : "$gray10"}
                      >
                        {item.completed ? "Completed" : "Pending"}
                      </Text>
                      <Text fontSize={16} fontWeight="bold">
                        {item.steps} steps
                      </Text>
                    </XStack>
                  </XStack>
                  {type === "daily" && (
                    <Text fontSize={12}>
                      {new Date(item.dailyChallengeName).toLocaleDateString()}
                    </Text>
                  )}
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
          <Text fontSize={16} color="$gray10">
            {activeTab === "daily" && "Daily Challenges"}
            {activeTab === "events" && "Event Challenges"}
            {activeTab === "friends" && "Friend Challenges"}
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
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <Tabs.List backgroundColor="$background">
            <Tabs.Tab flex={1} value="daily">
              <Text fontWeight={activeTab === "daily" ? "bold" : "normal"}>
                Daily
              </Text>
            </Tabs.Tab>
            <Tabs.Tab flex={1} value="events">
              <Text fontWeight={activeTab === "events" ? "bold" : "normal"}>
                Events
              </Text>
            </Tabs.Tab>
            <Tabs.Tab flex={1} value="friends">
              <Text fontWeight={activeTab === "friends" ? "bold" : "normal"}>
                Friends
              </Text>
            </Tabs.Tab>
          </Tabs.List>

          <Separator />

          <Tabs.Content value="daily" flex={1}>
            {renderContent("daily")}
          </Tabs.Content>

          <Tabs.Content value="events" flex={1}>
            {renderContent("events")}
          </Tabs.Content>

          <Tabs.Content value="friends" flex={1}>
            {renderContent("friends")}
          </Tabs.Content>
        </Tabs>
      </Card.Footer>
    </Card>
  );
};

export default HistoryCard;
