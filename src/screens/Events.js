import React from 'react'
import { YStack, XStack, Text } from 'tamagui'
import { Button } from 'tamagui';
import { ChevronLeft } from '@tamagui/lucide-icons';
import DrawerSceneWrapper from '../components/DrawerSceneWrapper'
import Header from '../components/Header';
import Map from '../components/Map';

const Events = ({navigation}) => {
  const { openDrawer } = navigation;
  return (
    <DrawerSceneWrapper>
        <YStack f={1} bg="$background">
          <Header navigation={navigation} />
          <YStack f={1}>
          <XStack ai="center" space="$3">
              <Button
                icon={ChevronLeft}
                onPress={() => navigation.goBack()}
                backgroundColor="transparent"
                size="$8"
                pl="$4"
              />
            </XStack>
            <Map />
          </YStack>
        </YStack>
    </DrawerSceneWrapper>
  )
}

export default Events

