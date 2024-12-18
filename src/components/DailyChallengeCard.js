import { View } from "react-native";
import React, { useEffect, useState } from "react";
import {
  Card,
  ScrollView,
  XStack,
  YStack,
  Text,
  Avatar,
  Image,
  Button,
  Label,
  useTheme,
  Spinner,
} from "tamagui";
import {
  Footprints,
  Flame,
  MapPin,
  Zap,
  Star,
  Award,
} from "@tamagui/lucide-icons";
import ActivityRings from "react-native-activity-rings";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../api/Auth";

const DailyChallengeCard = () => {
  const theme = useTheme();
  const [activityData, setActivityData] = useState([]);

  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
  });

  useEffect(() => {
    if (theme && profile) {
      // Find the active daily challenge
      const dailyChallenge = profile.challenges?.find(
        (c) => c.dailyChallengeId !== null
      );

      const stepsProgress = dailyChallenge ? dailyChallenge.steps / 10000 : 0; // 10000 steps goal
      const caloriesProgress = dailyChallenge
        ? (dailyChallenge.steps * 0.04) / 800
        : 0; // 400 calories goal
      const distanceProgress = dailyChallenge
        ? (dailyChallenge.steps * 0.0008) / 8
        : 0; // 8 km goal

      setActivityData([
        {
          label: "STEPS",
          value: stepsProgress,
          color: theme.lime7.val,
          backgroundColor: theme.lime10.val,
          valueFormatter: (value) => `${Math.round(value * 100)}%`,
          labelFontSize: 24,
        },
        {
          label: "KCAL",
          value: caloriesProgress,
          color: theme.magenta7.val,
          backgroundColor: theme.magenta10.val,
          valueFormatter: (value) => `${Math.round(value * 100)}%`,
          labelFontSize: 24,
        },
        {
          label: "KM",
          value: distanceProgress,
          color: theme.cyan7.val,
          backgroundColor: theme.cyan10.val,
          valueFormatter: (value) => `${Math.round(value * 100)}%`,
          labelFontSize: 24,
        },
      ]);
    }
  }, [theme, profile]);

  const activityRingConfig = {
    width: 150,
    height: 150,
    ringSize: 7,
    radius: 32,
    padAngle: 0.02,
    cornerRadius: 5,
    startAngle: 0,
    endAngle: 2 * Math.PI,
    animationDuration: 1000,
    animated: true,
    labelFontSize: 24,
    valueFormatter: (value) => `${Math.round(value * 100)}%`,
  };

  const achievements = [
    {
      id: 1,
      title: "7 Day Streak",
      icon: Zap,
      color: "$cyan",
    },
    {
      id: 2,
      title: "Early Bird",
      icon: Star,
      color: "$magenta",
    },
    {
      id: 3,
      title: "Marathon",
      icon: Award,
      color: "$lime",
    },
    {
      id: 4,
      title: "Explorer",
      icon: MapPin,
      color: "$cyan",
    },
    {
      id: 5,
      title: "Top Walker",
      icon: Footprints,
      color: "$magenta",
    },
  ];

  if (isLoading) {
    return (
      <Card
        elevate
        size="$4"
        bordered
        animation="bouncy"
        scale={0.9}
        color="$background"
        borderColor="$color4"
        bw={1}
      >
        <YStack padding="$4" alignItems="center" justifyContent="center">
          <Spinner size="large" color="$color" />
          <Text>Loading daily challenge...</Text>
        </YStack>
      </Card>
    );
  }

  if (error) {
    return (
      <Card
        elevate
        size="$4"
        bordered
        animation="bouncy"
        scale={0.9}
        color="$background"
        borderColor="$color4"
        bw={1}
      >
        <YStack padding="$4" alignItems="center">
          <Text color="$red10">Error loading daily challenge</Text>
        </YStack>
      </Card>
    );
  }

  const dailyChallenge = profile?.challenges?.find(
    (c) => c.dailyChallengeId !== null
  );

  return (
    <Card
      elevate
      size="$4"
      bordered
      animation="bouncy"
      scale={0.9}
      hoverStyle={{ scale: 0.925 }}
      color="$background"
      borderColor="$color4"
      bw={1}
    >
      <Card.Header padded>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <XStack space="$2.5">
            {achievements.map((achievement) => (
              <Card
                key={achievement.id}
                bordered
                bw={1}
                paddingHorizontal={2}
                size="$3"
                br="$9"
                backgroundColor="$background"
                borderColor={`${achievement.color}8`}
              >
                <Card.Footer p="$2">
                  <XStack space="$2" ai="center">
                    <achievement.icon
                      size={15}
                      color={`${achievement.color}8`}
                    />
                    <Text
                      color={`${achievement.color}11`}
                      fontWeight="bold"
                      fontSize={12}
                    >
                      {achievement.title}
                    </Text>
                  </XStack>
                </Card.Footer>
              </Card>
            ))}
          </XStack>
        </ScrollView>
      </Card.Header>
      <Card.Footer>
        <YStack flex={1} jc="center" ai="center">
          {/* Activity Rings */}
          <XStack>
            <ActivityRings data={activityData} config={activityRingConfig} />
          </XStack>

          <XStack space="$6" jc="space-between">
            <XStack ai="center" jc="space-between" space="$2">
              <Footprints size={18} color={theme.lime7.val} />
              <Label color="$lime7" theme="alt2">
                {dailyChallenge?.steps || 0}
              </Label>
            </XStack>
            <XStack ai="center" jc="space-between" space="$2">
              <Flame size={18} color={theme.magenta7.val} />
              <Label color="$magenta7">
                {((dailyChallenge?.steps || 0) * 0.04).toFixed(0)}
              </Label>
            </XStack>
            <XStack ai="center" jc="space-between" space="$2">
              <MapPin size={18} color={theme.cyan7.val} />
              <Label color="$cyan7" theme="alt2">
                {((dailyChallenge?.steps || 0) * 0.0008).toFixed(2)}km
              </Label>
            </XStack>
          </XStack>
        </YStack>
      </Card.Footer>
    </Card>
  );
};

export default DailyChallengeCard;
