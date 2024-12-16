import React from 'react'
import { YStack, XStack, Text, H5 } from 'tamagui'
import { Button } from 'tamagui';
import { ChevronLeft } from '@tamagui/lucide-icons';
import DrawerSceneWrapper from '../components/DrawerSceneWrapper'
import Header from '../components/Header';
import Map from '../components/Map';
import { TouchableOpacity } from 'react-native';

const Events = ({ navigation }) => {
  const { openDrawer } = navigation;
  return (
    <DrawerSceneWrapper>
        <YStack f={1} bg="$background">
          <Header navigation={navigation} />
          <YStack f={1}>
          <XStack ai="center" p="$3" space="$2">
            <TouchableOpacity onPress={() => navigation.goBack()} backgroundColor="transparent">
              <ChevronLeft size="$2" color={'$color'}/>
            </TouchableOpacity>
            <H5>
              Upcoming Events
            </H5>
            </XStack>
            <Map />
          </YStack>
        </YStack>
    </DrawerSceneWrapper>
  );
};

export default Events;
