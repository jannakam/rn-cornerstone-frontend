import React from "react";
import { YStack, XStack, Text } from "tamagui";
import DrawerSceneWrapper from "../components/DrawerSceneWrapper";
import Header from "../components/Header";
import Map from "../components/Map";

const Events = ({ navigation }) => {
  const { openDrawer } = navigation;
  return (
    <DrawerSceneWrapper>
      <YStack f={1} bg="$background">
        <Header navigation={navigation} />
        <YStack f={1}>
          <Text color="$color" bg="$background" p="$4">
            Events
          </Text>
          <Map />
        </YStack>
      </YStack>
    </DrawerSceneWrapper>
  );
};

export default Events;
