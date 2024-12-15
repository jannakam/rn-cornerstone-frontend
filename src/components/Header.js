import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Menu } from '@tamagui/lucide-icons'
import { TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { XStack, Image, YStack, Avatar } from 'tamagui';

const Header = ({navigation}) => {
    const { openDrawer } = navigation;

  return (
    <XStack ai="center" jc="space-between" p="$4" pt="$11">
        <TouchableOpacity onPress={openDrawer}>
              <Menu size={24} color="$color" />
        </TouchableOpacity>
        <YStack>
          <Image source={require('../../assets/stepwise_logo.png')} style={{ width: 30, height:50 }} />
        </YStack>
        <TouchableOpacity >
          <Avatar rounded size={24} bg="$color" />
        </TouchableOpacity>
    </XStack>
  )
}

export default Header

const styles = StyleSheet.create({})