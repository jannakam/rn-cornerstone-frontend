import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Menu } from '@tamagui/lucide-icons'
import { TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { XStack } from 'tamagui';

const Header = ({navigation}) => {
    const { openDrawer } = navigation;

  return (
    <XStack ai="center" jc="space-between" p="$4" pt="$11">
        <TouchableOpacity onPress={openDrawer}>
              <Menu size={24} color="$color" />
        </TouchableOpacity>
    </XStack>
  )
}

export default Header

const styles = StyleSheet.create({})