import React from 'react'
import { YStack, XStack, Text } from 'tamagui'
import DrawerSceneWrapper from '../components/DrawerSceneWrapper'
import { useNavigation } from '@react-navigation/native';
import { Menu } from '@tamagui/lucide-icons';
import { TouchableOpacity, View, SafeAreaView } from 'react-native';
import Map from '../components/Map';

const Events = ({navigation}) => {
  const { openDrawer } = navigation;
  return (
    <DrawerSceneWrapper>
      <SafeAreaView bg="$background">
        <XStack ai="center" jc="space-between" p="$4" pt="$8" bg="$background">
          <TouchableOpacity bg="$background" onPress={openDrawer}>
            <Menu size={20} color="$color" />
          </TouchableOpacity>
        </XStack>
        <Text>Events</Text>

        <Map />
    </SafeAreaView>
    </DrawerSceneWrapper>
  )
}

export default Events

