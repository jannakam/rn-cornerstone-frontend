import React from "react";
import { YStack, XStack, Text } from "tamagui";
import DrawerSceneWrapper from "../components/DrawerSceneWrapper";
import { useNavigation } from "@react-navigation/native";
import { Menu } from "@tamagui/lucide-icons";
import { TouchableOpacity, View, SafeAreaView } from "react-native";
import Login from "../components/Login";
import Signup from "../components/Signup";
import GetStarted from "../components/GetStarted";
import Header from "../components/Header";
import Challange from "../screens/Challange";

const Profile = ({ navigation }) => {
  const { openDrawer } = navigation;
  return (
    <DrawerSceneWrapper>
      {/* <SafeAreaView bg="$background" ai="center" jc="center"> */}
      {/* <XStack ai="center" jc="space-between" p="$4" pt="$8" bg="$background">
          <TouchableOpacity bg="$background" onPress={openDrawer}>
            <Menu size={20} color="$color" />
          </TouchableOpacity>
        </XStack> */}
      {/* </SafeAreaView> */}
      //{" "}
      <YStack f={1} bg="$background">
        // <Header navigation={navigation} />
        //{" "}
        <YStack f={1} p="$4">
          {/* here should be the content  */}
          <Challange />
        </YStack>
      </YStack>
    </DrawerSceneWrapper>
  );
};

export default Profile;
