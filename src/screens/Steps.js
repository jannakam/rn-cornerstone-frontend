import React from 'react'
import { YStack, XStack, Text } from 'tamagui'
import DrawerSceneWrapper from '../components/DrawerSceneWrapper'
import Header from '../components/Header';
import Signup from '../components/Signup';


const Steps = ({navigation}) => {
  const { openDrawer } = navigation;
  return (
    <DrawerSceneWrapper>
        <YStack f={1} bg="$background">
          <Header navigation={navigation} />
          <YStack f={1} p="$4">
            <Signup/>
          </YStack>
        </YStack>
    </DrawerSceneWrapper>
  )
}

export default Steps

