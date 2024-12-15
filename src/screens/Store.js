import React from 'react'
import { YStack, XStack, Text } from 'tamagui'
import DrawerSceneWrapper from '../components/DrawerSceneWrapper'
import Header from '../components/Header';

const Store = ({navigation}) => {
  const { openDrawer } = navigation;
  return (
    <DrawerSceneWrapper>
        <Header navigation={navigation} />
        <Text>Store</Text>
    </DrawerSceneWrapper>
  )
}

export default Store

