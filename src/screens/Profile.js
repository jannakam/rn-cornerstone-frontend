import React from 'react'
import { YStack } from 'tamagui'
import { SafeAreaView, ScrollView } from 'react-native';
import DrawerSceneWrapper from '../components/DrawerSceneWrapper'
import Header from '../components/Header';
import ProfileCard from '../components/ProfileCard';
import HistoryCard from '../components/HistoryCard';

const Profile = ({navigation}) => {
  return (
    <DrawerSceneWrapper>
        <YStack f={1} bg="$background">
          <Header navigation={navigation} />
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ 
              padding: '$4',
              margin: 10,
            }}
          >
            <YStack space="$4" flex={1} >
              <ProfileCard />
              <HistoryCard />
            </YStack>
          </ScrollView>
        </YStack>
    </DrawerSceneWrapper>
  )
}

export default Profile

