import React from 'react'
import { YStack, XStack, Text } from 'tamagui'
import DrawerSceneWrapper from '../components/DrawerSceneWrapper'
import { useNavigation } from '@react-navigation/native';
import { Menu } from '@tamagui/lucide-icons';
import { TouchableOpacity, View, SafeAreaView } from 'react-native';

const Profile = ({navigation}) => {
  const { openDrawer } = navigation;
  return (
    <DrawerSceneWrapper>
      <SafeAreaView bg="$background" ai="center" jc="center">
        <XStack ai="center" jc="space-between" p="$4" pt="$8" bg="$background">
          <TouchableOpacity bg="$background" onPress={openDrawer}>
            <Menu size={20} color="$color" />
          </TouchableOpacity>
        </XStack>
        <Text>Profile</Text>
    </SafeAreaView>
    </DrawerSceneWrapper>
  )
}

export default Profile
