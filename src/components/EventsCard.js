import { View } from 'react-native'
import React from 'react'
import { Card, ScrollView, XStack, YStack, Text, Avatar, Image, Button, Label, H6, useTheme } from 'tamagui'
import { Footprints, MapPin, ChevronRight } from '@tamagui/lucide-icons'
import { TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import locations from "../data/locations";

const EventsCard = () => {
    const theme = useTheme();
    const navigation = useNavigation();
    const events = locations;

    const handleEventPress = (event) => {
        navigation.navigate("EventDetail", { location: event });
    };

    const handleViewAllPress = () => {
        navigation.navigate("Events");
    };
  return (
    <Card
            elevate
            size="$4"
            bordered
            animation="bouncy"
            scale={0.9}
            hoverStyle={{ scale: 0.925 }}
            color="$background"
            f={1}
          >
            <Card.Header padded>
              <XStack jc="space-between" ai="center">
                <H6>Events</H6>
                <Button
                  size="$3"
                  variant="outlined"
                  onPress={handleViewAllPress}
                  iconAfter={ChevronRight}
                  borderColor="$color"
                  color="$color"
                  borderWidth={1}
                >
                  View all
                </Button>
              </XStack>
            </Card.Header>
            <Card.Footer padded f={1}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <XStack space="$3">
                  {events.map((event) => (
                    <TouchableOpacity
                      key={event.id}
                      onPress={() => handleEventPress(event)}
                    >
                      <Card bordered size="$4" width={300}>
                        <Card.Footer padded>
                          <YStack space="$2">
                            <Text fontSize={18} fontWeight="bold" color="$color">
                              {event.name}
                            </Text>
                            <XStack space="$4" ai="center">
                              <XStack space="$2" ai="center">
                                <Footprints size={16} color="$magenta7" />
                                <Text color="$color">{event.steps} steps</Text>
                              </XStack>
                              <XStack space="$2" ai="center">
                                <MapPin size={16} color="$lime7" />
                                <Text color="$color">{event.approx_distance}km</Text>
                              </XStack>
                            </XStack>
                          </YStack>
                        </Card.Footer>
                      </Card>
                    </TouchableOpacity>
                  ))}
                </XStack>
              </ScrollView>
            </Card.Footer>
          </Card>
  )
}

export default EventsCard

