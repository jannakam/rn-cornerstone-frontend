import React from 'react'
import { YStack, XStack, Text } from 'tamagui'
import DrawerSceneWrapper from '../components/DrawerSceneWrapper'
import Header from '../components/Header';

const Profile = ({navigation}) => {
  const { openDrawer } = navigation;
  return (
    <DrawerSceneWrapper>
        <YStack f={1} bg="$background">
          <Header navigation={navigation} />
          <YStack f={1} p="$4">
            <Text color="$color">Profile</Text>
          </YStack>
        </YStack>
    </DrawerSceneWrapper>
  )
}

export default Profile

