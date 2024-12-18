import React from 'react'
import { YStack, XStack, Text, H5, useTheme } from 'tamagui'
import { ChevronLeft } from '@tamagui/lucide-icons';
import DrawerSceneWrapper from '../components/DrawerSceneWrapper'
import Header from '../components/Header';
import Map from '../components/Map';
import { TouchableOpacity } from 'react-native';

const Events = ({ navigation }) => {
  const theme = useTheme();
  
  return (
    <DrawerSceneWrapper>
      <YStack f={1} bg="$background">
        <Header navigation={navigation} />
        <YStack f={1}>
          <XStack ai="center" p="$3" space="$2">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ChevronLeft size={24} color={theme.color.val}/>
            </TouchableOpacity>
            <H5 color="$color" fontSize="$6" fontWeight="bold">
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
