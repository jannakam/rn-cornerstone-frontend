import React from "react";
import { ScrollView, Pressable } from "react-native";
import { YStack, XStack, Text, Button, Popover, Card, H2 } from "tamagui";
import DrawerSceneWrapper from "../components/DrawerSceneWrapper";
import Header from "../components/Header";

const Store = ({ navigation }) => {
  const { openDrawer } = navigation;

  const eStores = [
    {
      id: 1,
      letter: "N",
      name: "Nike",
      color: "#00B8B9",
      description: "Get points for every purchase at Nike",
      pointsRate: "1 point = $1",
    },
    {
      id: 2,
      letter: "L",
      name: "Leila",
      color: "#FFB800",
      description: "only redeemable in restaurant",
      pointsRate: "100 point = $1",
    },
    {
      id: 3,
      letter: "D",
      name: "Dabdoob",
      color: "#B85FF6",
      description: "not applicable for lego sets",
      pointsRate: "100 point = $1",
    },
    {
      id: 4,
      letter: "R",
      name: "Reebok",
      color: "#FF8A00",
      description: "Discount on all clothing, only redeemable in store",
      pointsRate: "100 point = %10",
    },
    {
      id: 5,
      letter: "A",
      name: "The Athlete's Foot",
      color: "#FF5FA5",
      description: "Discount on all clothing, only redeemable in store",
      pointsRate: "100 point = %10",
    },
    {
      id: 6,
      letter: "N",
      name: "NorthFace",
      color: "#00B8B9",
      description: "Discount on all clothing, only redeemable in store",
      pointsRate: "100 point = %10",
    },
  ];

  const bills = [
    {
      id: 1,
      letter: "Z",
      name: "Zain",
      color: "#B85FF6",
      description: "Pay your Zain bills",
      pointsRate: "1000 point = 1 KD",
    },
    {
      id: 2,
      letter: "O",
      name: "Ooredoo",
      color: "#FFB800",
      description: "Pay your Ooredoo bills",
      pointsRate: "1000 point = 1 KD",
    },
    {
      id: 3,
      letter: "S",
      name: "STC",
      color: "#00B8B9",
      description: "Pay your STC bills",
      pointsRate: "1000 point = 1 KD",
    },
  ];

  return (
    <DrawerSceneWrapper>
      <YStack f={1} bg="$background">
        <Header navigation={navigation} />
        <ScrollView>
          <YStack f={1} space="$4" alignItems="center" margin="$2">
            {/* Points Circle */}
            <Card
              elevate
              size="$4"
              bordered
              animation="bouncy"
              scale={0.9}
              hoverStyle={{ scale: 0.925 }}
              pressStyle={{ scale: 0.95 }}
              color="$background"
              width="100%"
              alignItems="center"
            >
              <Card.Header padded width="100%">
                <H2>Your Points</H2>
              </Card.Header>
              <Card.Footer padded>
                <YStack
                  width={200}
                  height={200}
                  borderRadius={100}
                  borderWidth={4}
                  borderColor="#00B8B9"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text color="$color" fontSize={40} fontWeight="bold">
                    4567
                  </Text>
                  <Text color="$color" opacity={0.6} fontSize={16}>
                    POINTS
                  </Text>
                </YStack>
              </Card.Footer>
            </Card>

            {/* E-stores Section */}
            <Card
              elevate
              size="$4"
              bordered
              animation="bouncy"
              scale={0.9}
              hoverStyle={{ scale: 0.925 }}
              color="$background"
              alignItems="center"
              width="100%"
            >
              <Card.Header padded width="100%">
                <H2>E-stores</H2>
              </Card.Header>
              <Card.Footer padded>
                <XStack flexWrap="wrap" justifyContent="space-between">
                  {eStores.map((store) => (
                    <YStack key={store.id} width="30%" marginBottom="$4" alignItems="center">
                      <Popover placement="top">
                        <Popover.Trigger asChild>
                          <Button
                            width={60}
                            height={60}
                            borderRadius={16}
                            backgroundColor="$background"
                            borderColor="$borderColor"
                            marginBottom="$2"
                          >
                            <Text color={store.color} fontSize={24}>
                              {store.letter}
                            </Text>
                          </Button>
                        </Popover.Trigger>

                        <Popover.Content
                          borderWidth={1}
                          borderColor="$borderColor"
                          enterStyle={{ y: -10, opacity: 0 }}
                          exitStyle={{ y: -10, opacity: 0 }}
                          elevate
                          animation="quick"
                          backgroundColor="$background"
                          padding="$4"
                          zIndex={1000}
                        >
                          <YStack space="$3">
                            <Text
                              color="$color"
                              fontSize={18}
                              fontWeight="bold"
                            >
                              {store.name}
                            </Text>
                            <Text color="$color" opacity={0.6} fontSize={14}>
                              {store.description}
                            </Text>
                            <Text color={store.color} fontSize={14}>
                              {store.pointsRate}
                            </Text>
                          </YStack>
                        </Popover.Content>
                      </Popover>
                      <Text color="$color" opacity={0.6} fontSize={12} textAlign="center">
                        {store.name}
                      </Text>
                    </YStack>
                  ))}
                </XStack>
              </Card.Footer>
            </Card>

            {/* Bills Section */}
            <Card
              elevate
              size="$3"
              bordered
              animation="bouncy"
              scale={0.9}
              hoverStyle={{ scale: 0.925 }}
              color="$background"
              alignItems="center"
              width="100%"
              marginBottom="$8"
            >
              <Card.Header padded width="100%">
                <H2>Bills</H2>
              </Card.Header>
              <Card.Footer padded>
                <XStack justifyContent="space-between">
                  {bills.map((bill) => (
                    <YStack key={bill.id} width="30%" alignItems="center">
                      <Popover placement="top">
                        <Popover.Trigger asChild>
                          <Button
                            width={60}
                            height={60}
                            borderRadius={16}
                            backgroundColor="$background"
                            borderColor="$borderColor"
                            marginBottom="$2"
                          >
                            <Text color={bill.color} fontSize={24}>
                              {bill.letter}
                            </Text>
                          </Button>
                        </Popover.Trigger>

                        <Popover.Content
                          borderWidth={1}
                          borderColor="$borderColor"
                          enterStyle={{ y: -10, opacity: 0 }}
                          exitStyle={{ y: -10, opacity: 0 }}
                          elevate
                          animation="quick"
                          backgroundColor="$background"
                          padding="$4"
                          zIndex={1000}
                        >
                          <YStack space="$3">
                            <Text
                              color="$color"
                              fontSize={18}
                              fontWeight="bold"
                            >
                              {bill.name}
                            </Text>
                            <Text color="$color" opacity={0.6} fontSize={14}>
                              {bill.description}
                            </Text>
                            <Text color={bill.color} fontSize={14}>
                              {bill.pointsRate}
                            </Text>
                          </YStack>
                        </Popover.Content>
                      </Popover>
                      <Text color="$color" opacity={0.6} fontSize={12}>
                        {bill.name}
                      </Text>
                    </YStack>
                  ))}
                </XStack>
              </Card.Footer>
            </Card>
          </YStack>
        </ScrollView>
      </YStack>
    </DrawerSceneWrapper>
  );
};

export default Store;
