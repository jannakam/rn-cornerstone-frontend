import React from 'react'
import { YStack, XStack, Text } from 'tamagui'
import DrawerSceneWrapper from '../components/DrawerSceneWrapper'
import Header from '../components/Header';
import Signup from '../components/Signup';
import Pedometer from '../components/Pedometer';


const Steps = ({navigation}) => {
  const { openDrawer } = navigation;
  return (
    <DrawerSceneWrapper>
        <YStack f={1} bg="$background">
          <Header navigation={navigation} />
          <YStack f={1} p="$4">
            {/* <Pedometer/> */}
          </YStack>
        </YStack>
    </DrawerSceneWrapper>
  )
}

export default Steps

