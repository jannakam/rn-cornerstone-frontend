import React from 'react'
import { YStack, XStack, Text, Card, Button, H2, Paragraph, Label, Avatar, ZStack } from 'tamagui'
import DrawerSceneWrapper from '../components/DrawerSceneWrapper'
import { useNavigation } from '@react-navigation/native';
import { Menu, Flame, Footprints, MapPin, Plus, ChevronRight } from '@tamagui/lucide-icons';
import { TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import ActivityRings from "react-native-activity-rings"
import Header from '../components/Header';

const activityRingConfig = {
  width: 150,
  height: 150,
  ringSize: 10,
  radius: 32,
  padAngle: 0.02,
  cornerRadius: 5,
  startAngle: 0,
  endAngle: 2 * Math.PI,
  animationDuration: 1000,
  animated: true,
  labelFontSize: 24,
  valueFormatter: (value) => `${Math.round(value * 100)}%`,
};

const Home = () => {
    const navigation = useNavigation();
    const activityData = [
      {
        label: "ACTIVITY",
        value: 0.6,
        color: "lime",
        backgroundColor: "#000000",
        valueFormatter: (value) => `${Math.round(value * 100)}%`,
        labelFontSize: 24,
      },
      {
        value: 0.6,
        color: "violet",
        backgroundColor: "#000000",
        valueFormatter: (value) => `${Math.round(value * 100)}%`,
        labelFontSize: 24,
      },
      {
        label: "RINGS",
        value: 0.5,
        color: "cyan",
        backgroundColor: "#000000",
        valueFormatter: (value) => `${Math.round(value * 100)}%`,
        labelFontSize: 24,
      }
    ];

    const friends = [
      { id: 1, name: 'Sarah Chen', avatar: 'https://github.com/tamagui.png' },
      { id: 2, name: 'Mike Johnson', avatar: 'https://github.com/tamagui.png' },
      { id: 3, name: 'Emma Wilson', avatar: 'https://github.com/tamagui.png' },
      { id: 4, name: 'James Smith', avatar: 'https://github.com/tamagui.png' },
      { id: 5, name: 'James Smith', avatar: 'https://github.com/tamagui.png' },
      { id: 6, name: 'James Smith', avatar: 'https://github.com/tamagui.png' }
    ];

    const events = [
      {
        id: 1,
        name: 'City Park Trail',
        steps: 8000,
        approx_distance: 5.2,
        latitude: 37.7749,
        longitude: -122.4194,
        checkpoints: [
          { id: 1, name: 'Entrance Gate', points: 50, steps: 0, latitude: 37.7749, longitude: -122.4194, approx_distance: 0 },
          { id: 2, name: 'Lake View', points: 100, steps: 2000, latitude: 37.7750, longitude: -122.4195, approx_distance: 1.2 },
        ]
      },
      {
        id: 2,
        name: 'Downtown Walk',
        steps: 6000,
        approx_distance: 3.8,
        latitude: 37.7833,
        longitude: -122.4167,
        checkpoints: [
          { id: 1, name: 'Start Point', points: 50, steps: 0, latitude: 37.7833, longitude: -122.4167, approx_distance: 0 },
          { id: 2, name: 'City Square', points: 100, steps: 1500, latitude: 37.7834, longitude: -122.4168, approx_distance: 0.8 },
        ]
      },
    ];

    const handleEventPress = (event) => {
      navigation.navigate('EventDetail', { location: event });
    };

    const handleViewAllPress = () => {
      navigation.navigate('Events');
    };

    return (
    <DrawerSceneWrapper>
        <YStack f={1} bg="$background">
          <Header navigation={navigation} />
          
          <YStack f={1} space="$4" margin="$2">
            <Card
              elevate
              size="$4"
              bordered
              animation="bouncy"
              scale={0.9}
              hoverStyle={{ scale: 0.925 }}
              pressStyle={{ scale: 0.95 }}
              color="$background"
            >
              <Card.Header padded>
                <H2>Your daily activity summary</H2>
              </Card.Header>
              <Card.Footer padded>
                <YStack flex={1} jc="center" ai="center">

                  {/* Activity Rings */}
                  <XStack>
                    <ActivityRings 
                      data={activityData} 
                      config={activityRingConfig}
                    />
                  </XStack>

                  <XStack space="$4" jc="space-between">
                    <XStack ai="center" jc="space-between" space="$2">   
                      <Footprints size={18} color="$color" />
                      <Label color="$color" theme="alt2">
                        5647
                    </Label>
                    </XStack>
                    <XStack ai="center" jc="space-between" space="$2">
                      <Flame size={18} color="$color" />
                      <Label color="$color">
                        1245
                      </Label>
                    </XStack>
                    <XStack ai="center" jc="space-between" space="$2">
                      <MapPin size={18} color="$color" />
                      <Label color="$color" theme="alt2">
                        3.45km
                      </Label>
                    </XStack>
                  </XStack>
                </YStack>
              </Card.Footer>
            </Card>

            <Card
              elevate
              size="$4"
              bordered
              animation="bouncy"
              scale={0.9}
              hoverStyle={{ scale: 0.925 }}
              color="$background"
            >
              <Card.Header padded>
                <H2>
                  Friends
                </H2>
              </Card.Header>
              <Card.Footer padded>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <XStack gap="$4">
                    {/* Add Friend Avatar */}
                    <YStack ai="center">
                      <Avatar circular size="$6" borderWidth={1} borderColor="$color">
                        <Avatar.Fallback backgroundColor="transparent" jc="center" ai="center">
                          <Plus size={24} color="$color" />
                        </Avatar.Fallback>
                      </Avatar>
                    </YStack>
                    
                    {/* Friend Avatars */}
                    {friends.map((friend) => (
                      <YStack key={friend.id} ai="center">
                        <Avatar circular size="$6">
                          <Avatar.Image source={{ uri: friend.avatar }}/>
                          <Avatar.Fallback backgroundColor="$blue10" />
                        </Avatar>
                      </YStack>
                    ))}
                  </XStack>
                </ScrollView>
              </Card.Footer>
            </Card>

            <Card
              elevate
              size="$4"
              bordered
              animation="bouncy"
              scale={0.9}
              hoverStyle={{ scale: 0.925 }}
              color="$background"
            >
              <Card.Header padded>
                <XStack jc="space-between" ai="center">
                  <H2>Events</H2>
                  <Button
                    size="$3"
                    variant="outlined"
                    onPress={handleViewAllPress}
                    iconAfter={ChevronRight}
                  >
                    View all
                  </Button>
                </XStack>
              </Card.Header>
              <Card.Footer padded>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <XStack space="$3">
                  {events.map((event) => (
                    <TouchableOpacity 
                      key={event.id}
                      onPress={() => handleEventPress(event)}
                    >
                      <Card bordered size="$2">
                        <Card.Header padded>
                          <XStack jc="space-between" ai="center">
                            <Text fontSize={16} fontWeight="bold">{event.name} </Text>
                            <XStack space="$2" ai="center">
                              <Footprints size={16} color="$color" />
                              <Text>{event.steps}</Text>
                              <MapPin size={16} color="$color" />
                              <Text>{event.approx_distance}km</Text>
                            </XStack>
                          </XStack>
                        </Card.Header>
                      </Card>
                    </TouchableOpacity>
                  ))}
                  </XStack>
                </ScrollView>
              </Card.Footer>
            </Card>
          </YStack>
        </YStack>
    </DrawerSceneWrapper>
  );
}

export default Home