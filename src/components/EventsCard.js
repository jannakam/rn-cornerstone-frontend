import { View } from 'react-native'
import React from 'react'
import { Card, ScrollView, XStack, YStack, Text, Avatar, Image, Button, Label, H5, useTheme } from 'tamagui'
import { Footprints, MapPin, ChevronRight, Store } from '@tamagui/lucide-icons'
import { TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import locations from "../data/locations";
import sponsors from "../data/sponsors";

const EventsCard = () => {
    const theme = useTheme();
    const navigation = useNavigation();
    
    // Find nearest sponsor for each event using the same distance calculation as EventDetail
    const events = locations.map(location => {
      const nearbySponsors = sponsors.filter(sponsor => {
        const distance = Math.sqrt(
          Math.pow(sponsor.latitude - location.latitude, 2) + 
          Math.pow(sponsor.longitude - location.longitude, 2)
        );
        return distance < 0.05; // Same 5km radius as EventDetail
      });
      return {
        ...location,
        sponsor: nearbySponsors.length > 0 ? nearbySponsors[0] : null
      };
    });

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
      borderColor="$color4"
      bw={1}
    >
      <Card.Header padded>
        <XStack jc="space-between" ai="center">
          <H5 color="$color">Featured Events</H5>
          <Button
            size="$3"
            variant="outlined"
            onPress={handleViewAllPress}
            iconAfter={ChevronRight}
            borderRadius="$8"
            color="$color"
            borderColor="$color8"
            borderWidth={1}
          >
            View all
          </Button>
        </XStack>
      </Card.Header>
      <Card.Footer padded f={1} pt="$0">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <XStack space="$3">
            {events.map((event) => (
              <TouchableOpacity
                key={event.id}
                onPress={() => handleEventPress(event)}
              >
                <Card bordered size="$4" f={1}>
                  <YStack f={1} space="$2" p="$4">
                    <H5 color="$color">{event.name}</H5>
                    
                    <XStack space="$4" ai="center">
                      <XStack space="$2" ai="center">
                        <Footprints size={16} color={theme.magenta7.val} />
                        <Text color="$color">{event.steps} steps</Text>
                      </XStack>
                      <XStack space="$2" ai="center">
                        <MapPin size={16} color={theme.lime7.val} />
                        <Text color="$color">{event.approx_distance}km</Text>
                      </XStack>
                    </XStack>

                    <Text color="$color" opacity={0.7}>
                      {event.checkpoints.length} checkpoints
                    </Text>

                    {event.sponsor && (
                      <YStack mt="$3" space="$2">
                        <XStack space="$2" ai="center">
                          <Image 
                            source={event.sponsor.logo}
                            style={{
                              width: 30,
                              height: 30,
                              borderRadius: 15,
                            }}
                          />
                          <YStack>
                            <Text color="$color" fontWeight="bold">{event.sponsor.name}</Text>
                            <Text color={theme.cyan8.val} fontWeight="bold">
                              {event.sponsor.discount}
                            </Text>
                          </YStack>
                        </XStack>
                      </YStack>
                    )}
                  </YStack>
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

