import React, { useState } from "react";
import { ScrollView, Pressable, View, Alert } from "react-native";
import {
  YStack,
  XStack,
  Text,
  Button,
  Popover,
  Card,
  H2,
  H5,
  H6,
  useTheme,
  Spinner,
} from "tamagui";
import DrawerSceneWrapper from "../components/DrawerSceneWrapper";
import Header from "../components/Header";
import { Store as StoreIcon, ChevronRight } from "@tamagui/lucide-icons";
import { Pedometer } from "expo-sensors";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserProfile, updateUser } from "../api/Auth";

const Store = ({ navigation }) => {
  const { openDrawer } = navigation;
  const theme = useTheme();
  const [openStoreId, setOpenStoreId] = useState(null);
  const queryClient = useQueryClient();

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
  });

  const eStores = [
    {
      id: 1,
      letter: "N",
      name: "Nike",
      color: theme.cyan7.val,
      description: "Get points for every purchase at Nike",
      pointsRate: "1 point = $1",
    },
    {
      id: 2,
      letter: "L",
      name: "Leila",
      color: theme.magenta7.val,
      description: "only redeemable in restaurant",
      pointsRate: "100 point = $1",
    },
    {
      id: 3,
      letter: "D",
      name: "Dabdoob",
      color: theme.lime7.val,
      description: "not applicable for lego sets",
      pointsRate: "100 point = $1",
    },
    {
      id: 4,
      letter: "R",
      name: "Reebok",
      color: theme.cyan7.val,
      description: "Discount on all clothing, only redeemable in store",
      pointsRate: "100 point = %10",
    },
    {
      id: 5,
      letter: "A",
      name: "The Athlete's Foot",
      color: theme.magenta7.val,
      description: "Discount on all clothing, only redeemable in store",
      pointsRate: "100 point = %10",
    },
    {
      id: 6,
      letter: "N",
      name: "NorthFace",
      color: theme.lime7.val,
      description: "Discount on all clothing, only redeemable in store",
      pointsRate: "100 point = %10",
    },
  ];

  const bills = [
    {
      id: 1,
      letter: "Z",
      name: "Zain",
      color: theme.lime7.val,
      description: "Pay your Zain bills",
      pointsRate: "1000 point = 1 KD",
    },
    {
      id: 2,
      letter: "O",
      name: "Ooredoo",
      color: theme.magenta7.val,
      description: "Pay your Ooredoo bills",
      pointsRate: "1000 point = 1 KD",
    },
    {
      id: 3,
      letter: "S",
      name: "STC",
      color: theme.cyan7.val,
      description: "Pay your STC bills",
      pointsRate: "1000 point = 1 KD",
    },
  ];

  const rewards = [
    {
      id: 1,
      name: "Nike Gift Card",
      points: 5000,
      value: "50 KWD",
      color: theme.cyan7.val,
      description: "Redeem for a 50 KWD Nike gift card",
    },
    {
      id: 2,
      name: "Leila Restaurant Voucher",
      points: 3000,
      value: "30 KWD",
      color: theme.magenta7.val,
      description: "Enjoy a meal at Leila Restaurant",
    },
    {
      id: 3,
      name: "Reebok Discount",
      points: 2000,
      value: "20 KWD",
      color: theme.lime7.val,
      description: "Get 20% off your next purchase",
    },
    {
      id: 4,
      name: "Free Coffee",
      points: 1000,
      value: "5 KWD",
      color: theme.cyan7.val,
      description: "Redeem for a free coffee at any partner cafe",
    },
  ];

  const handleRedemption = async (reward) => {
    try {
      // Get current profile data
      const currentProfile = queryClient.getQueryData(["userProfile"]);

      if (!currentProfile || currentProfile.points < reward.points) {
        Alert.alert("Error", "Not enough points!");
        return;
      }

      // Calculate new points balance
      const newPoints = currentProfile.points - reward.points;

      // Update the points in the backend
      await updateUser({
        points: newPoints,
        // Include other required user fields that shouldn't change
        username: currentProfile.username,
        age: currentProfile.age,
        city: currentProfile.city,
        weight: currentProfile.weight,
        height: currentProfile.height,
      });

      // Update local cache
      queryClient.setQueryData(["userProfile"], (old) => ({
        ...old,
        points: newPoints,
      }));

      // Invalidate the query to ensure fresh data
      queryClient.invalidateQueries(["userProfile"]);

      Alert.alert(
        "Success!",
        `You have successfully redeemed ${reward.name}. Your new balance is ${newPoints} points.`,
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error("Redemption error:", error);
      Alert.alert("Error", "Failed to process redemption. Please try again.", [
        { text: "OK" },
      ]);
    }
  };

  return (
    <DrawerSceneWrapper>
      <YStack f={1} bg="$background">
        <Header navigation={navigation} />
        <ScrollView>
          <YStack f={1} space="$3" p="$3">
            {/* Points Card */}
            <Card
              elevate
              size="$2"
              bordered
              padded
              animation="bouncy"
              scale={0.9}
              hoverStyle={{ scale: 0.925 }}
              pressStyle={{ scale: 0.95 }}
              color="$background"
              borderColor="$color4"
              bw={1}
            >
              <Card.Footer padded p="$3" jc="center">
                <YStack
                  width={200}
                  height={200}
                  borderRadius={100}
                  borderWidth={4}
                  borderColor={theme.cyan7.val}
                  alignItems="center"
                  justifyContent="center"
                  alignSelf="center"
                >
                  {isProfileLoading ? (
                    <Spinner size="large" color="$color" />
                  ) : (
                    <>
                      <Text color="$color" fontSize={40} fontWeight="bold">
                        {profile?.points || 0}
                      </Text>
                      <Text color="$color" opacity={0.6} fontSize={16}>
                        POINTS
                      </Text>
                    </>
                  )}
                </YStack>
              </Card.Footer>
            </Card>

            {/* E-stores Card */}
            <Card
              elevate
              size="$2"
              bordered
              animation="bouncy"
              scale={0.9}
              hoverStyle={{ scale: 0.925 }}
              color="$background"
              borderColor="$color4"
              bw={1}
            >
              <Card.Header padded p="$3">
                <H5 color="$color">E-stores</H5>
              </Card.Header>
              <Card.Footer padded p="$3">
                <XStack flexWrap="wrap" justifyContent="space-between">
                  {eStores.map((store) => (
                    <YStack
                      key={store.id}
                      width="30%"
                      marginBottom="$4"
                      alignItems="center"
                    >
                      <Popover
                        size="$5"
                        allowFlip
                        placement="top"
                        open={openStoreId === store.id}
                        onOpenChange={(open) => {
                          setOpenStoreId(open ? store.id : null);
                        }}
                      >
                        <Popover.Trigger asChild>
                          <Button
                            width={60}
                            height={60}
                            borderRadius={16}
                            backgroundColor="$background"
                            borderColor="$color4"
                            marginBottom="$2"
                            pressStyle={{ scale: 0.95 }}
                          >
                            <Text color={store.color} fontSize={24}>
                              {store.letter}
                            </Text>
                          </Button>
                        </Popover.Trigger>

                        {openStoreId === store.id && (
                          <Popover.Content
                            borderWidth={1}
                            borderColor="$color4"
                            enterStyle={{ opacity: 0 }}
                            exitStyle={{ opacity: 0 }}
                            elevate
                            animation="lazy"
                            backgroundColor="$background"
                            padding="$4"
                            zIndex={1000}
                          >
                            <YStack space="$3" width={250}>
                              <XStack space="$3" ai="center" jc="space-between">
                                <YStack>
                                  <Text
                                    color="$color"
                                    fontSize={18}
                                    fontWeight="bold"
                                  >
                                    {store.name}
                                  </Text>
                                  <Text
                                    color="$color"
                                    opacity={0.6}
                                    fontSize={14}
                                  >
                                    {store.description}
                                  </Text>
                                </YStack>
                                <ChevronRight
                                  size={20}
                                  color={theme.color.val}
                                />
                              </XStack>
                              <Text
                                color={store.color}
                                fontSize={16}
                                fontWeight="bold"
                              >
                                {store.pointsRate}
                              </Text>
                            </YStack>
                          </Popover.Content>
                        )}
                      </Popover>
                      <Text
                        color="$color"
                        opacity={0.6}
                        fontSize={12}
                        textAlign="center"
                      >
                        {store.name}
                      </Text>
                    </YStack>
                  ))}
                </XStack>
              </Card.Footer>
            </Card>

            {/* Bills Card */}
            <Card
              elevate
              size="$2"
              bordered
              animation="bouncy"
              scale={0.9}
              hoverStyle={{ scale: 0.925 }}
              color="$background"
              borderColor="$color4"
              bw={1}
            >
              <Card.Header padded p="$3">
                <H5 color="$color">Bills</H5>
              </Card.Header>
              <Card.Footer padded p="$3">
                <XStack
                  justifyContent="space-between"
                  flexWrap="wrap"
                  ai="center"
                  width="100%"
                >
                  {bills.map((bill) => (
                    <YStack key={bill.id} width="30%" alignItems="center">
                      <Popover
                        size="$5"
                        allowFlip
                        placement="top"
                        open={openStoreId === `bill-${bill.id}`}
                        onOpenChange={(open) => {
                          setOpenStoreId(open ? `bill-${bill.id}` : null);
                        }}
                      >
                        <Popover.Trigger asChild>
                          <Button
                            width={60}
                            height={60}
                            borderRadius={16}
                            backgroundColor="$background"
                            borderColor="$color4"
                            marginBottom="$2"
                            pressStyle={{ scale: 0.95 }}
                          >
                            <Text color={bill.color} fontSize={24}>
                              {bill.letter}
                            </Text>
                          </Button>
                        </Popover.Trigger>

                        {openStoreId === `bill-${bill.id}` && (
                          <Popover.Content
                            borderWidth={1}
                            borderColor="$color4"
                            enterStyle={{ opacity: 0 }}
                            exitStyle={{ opacity: 0 }}
                            elevate
                            animation="lazy"
                            backgroundColor="$background"
                            padding="$4"
                            zIndex={1000}
                          >
                            <YStack space="$3" width={250}>
                              <XStack space="$3" ai="center" jc="space-between">
                                <YStack>
                                  <Text
                                    color="$color"
                                    fontSize={18}
                                    fontWeight="bold"
                                  >
                                    {bill.name}
                                  </Text>
                                  <Text
                                    color="$color"
                                    opacity={0.6}
                                    fontSize={14}
                                  >
                                    {bill.description}
                                  </Text>
                                </YStack>
                                <ChevronRight
                                  size={20}
                                  color={theme.color.val}
                                />
                              </XStack>
                              <Text
                                color={bill.color}
                                fontSize={16}
                                fontWeight="bold"
                              >
                                {bill.pointsRate}
                              </Text>
                            </YStack>
                          </Popover.Content>
                        )}
                      </Popover>
                      <Text color="$color" opacity={0.6} fontSize={12}>
                        {bill.name}
                      </Text>
                    </YStack>
                  ))}
                </XStack>
              </Card.Footer>
            </Card>

            {/* Rewards Card */}
            <Card
              elevate
              size="$2"
              bordered
              animation="bouncy"
              scale={0.9}
              hoverStyle={{ scale: 0.925 }}
              color="$background"
              borderColor="$color4"
              bw={1}
              marginBottom="$4"
            >
              <Card.Header padded p="$3">
                <H5 color="$color">Rewards</H5>
              </Card.Header>
              <Card.Footer padded p="$3">
                <YStack space="$3" width="100%">
                  {rewards.map((reward) => (
                    <Card
                      key={reward.id}
                      bordered
                      size="$2"
                      animation="bouncy"
                      backgroundColor="$background"
                      borderColor="$color4"
                      f={1}
                      padded
                    >
                      <Card.Header padded p="$2">
                        <XStack
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <YStack f={1} mr="$3">
                            <Text
                              color="$color"
                              fontSize={16}
                              fontWeight="bold"
                            >
                              {reward.name}
                            </Text>
                            <Text color="$color" opacity={0.6} fontSize={14}>
                              {reward.description}
                            </Text>
                          </YStack>
                          <Text
                            color={reward.color}
                            fontSize={18}
                            fontWeight="bold"
                          >
                            {reward.value}
                          </Text>
                        </XStack>
                      </Card.Header>
                      <Card.Footer padded p="$2">
                        <XStack
                          justifyContent="space-between"
                          alignItems="center"
                          width="100%"
                        >
                          <Text color="$color" fontSize={16}>
                            {reward.points} points
                          </Text>
                          <Button
                            size="$4"
                            theme={
                              profile?.points >= reward.points
                                ? "active"
                                : "gray"
                            }
                            disabled={
                              !profile?.points || profile.points < reward.points
                            }
                            onPress={() => {
                              Alert.alert(
                                "Confirm Redemption",
                                `Are you sure you want to redeem ${reward.name} for ${reward.points} points?`,
                                [
                                  {
                                    text: "Cancel",
                                    style: "cancel",
                                  },
                                  {
                                    text: "Redeem",
                                    onPress: () => handleRedemption(reward),
                                  },
                                ]
                              );
                            }}
                            borderRadius="$8"
                          >
                            {profile?.points >= reward.points
                              ? "Redeem"
                              : "Not enough points"}
                          </Button>
                        </XStack>
                      </Card.Footer>
                    </Card>
                  ))}
                </YStack>
              </Card.Footer>
            </Card>
          </YStack>
        </ScrollView>
      </YStack>
    </DrawerSceneWrapper>
  );
};

export default Store;
