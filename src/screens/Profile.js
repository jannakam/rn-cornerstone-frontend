import React from "react";
import { YStack } from "tamagui";
import { SafeAreaView, ScrollView } from "react-native";
import DrawerSceneWrapper from "../components/DrawerSceneWrapper";
import Header from "../components/Header";
import ProfileCard from "../components/ProfileCard";
import HistoryCard from "../components/HistoryCard";

const Profile = ({ navigation }) => {
  return (
    <DrawerSceneWrapper>
      <SafeAreaView style={{ flex: 1, backgroundColor: "$background" }}>
        <YStack f={1} bg="$background">
          <Header navigation={navigation} />
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 16 }}
          >
            <YStack space="$4">
              <ProfileCard />
              <HistoryCard />
            </YStack>
          </ScrollView>
        </YStack>
      </SafeAreaView>
    </DrawerSceneWrapper>
  );
};

export default Profile;
