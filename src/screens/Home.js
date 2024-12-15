import React from "react";
import {
  YStack,
  XStack,
  Text,
  Card,
  Button,
  H2,
} from "tamagui";
import DrawerSceneWrapper from "../components/DrawerSceneWrapper";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import locations from "../data/locations";
import DailyChallengeCard from "../components/DailyChallengeCard";
import FriendsList from "../components/FriendsList";
import EventsCard from "../components/EventsCard";


const Home = () => {
  const navigation = useNavigation();

  return (
    <DrawerSceneWrapper>
      <YStack f={1} bg="$background">
        <Header navigation={navigation} />

        <YStack f={1} space="$4" margin="$2">
          <DailyChallengeCard />
          <FriendsList /> 
          <EventsCard />
        </YStack>
      </YStack>
    </DrawerSceneWrapper>
  );
};

export default Home;
