import React from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import { YStack, XStack, Text, Button, H2, Card, ScrollView } from 'tamagui';
import MapView, { Marker, UrlTile, Callout } from 'react-native-maps';
import { Footprints, MapPin, ChevronLeft } from '@tamagui/lucide-icons';
import Header from '../components/Header';

const EventDetail = ({ route, navigation }) => {
  const { location } = route.params;

  return (
    <YStack f={1} bg="$background">
        <Header navigation={navigation} />
        <XStack p="$4" ai="center" space="$2">
          <Button
            icon={ChevronLeft}
            onPress={() => navigation.goBack()}
            backgroundColor="transparent"
          />
          <Text fontSize={20} fontWeight="bold">{location.name}</Text>
        </XStack>

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          mapType="mutedStandard"
          userInterfaceStyle="dark"
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <UrlTile
            urlTemplate={'https://d.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'}
            shouldReplaceMapContent={true}
            maximumZ={19}
            flipY={false}
          />
          {/* Main location marker */}
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
          >
            <Callout tooltip>
              <Card bordered size="$2" bg="$background">
                <Card.Header padded>
                  <YStack space="$2">
                    <Text color="$color" fontWeight="bold">{location.name}</Text>
                    <XStack space="$2">
                      <Footprints size={16} color="$color" />
                      <Text color="$color">{location.steps}</Text>
                      <MapPin size={16} color="$color" />
                      <Text color="$color">{location.approx_distance} km</Text>
                    </XStack>
                  </YStack>
                </Card.Header>
              </Card>
            </Callout>
          </Marker>
          {/* Checkpoint markers */}
          {location.checkpoints.map((checkpoint) => (
            <Marker
              key={checkpoint.id}
              coordinate={{
                latitude: checkpoint.latitude,
                longitude: checkpoint.longitude,
              }}
              pinColor="blue"
            >
              <Callout tooltip>
                <Card bordered size="$2" bg="$background">
                  <Card.Header padded>
                    <YStack space="$2">
                      <Text color="$color" fontWeight="bold">{checkpoint.name}</Text>
                      <XStack space="$2">
                        <Text color="$color">{checkpoint.points} points</Text>
                        <Text color="$color">•</Text>
                        <Text color="$color">{checkpoint.steps} steps</Text>
                      </XStack>
                      <Text color="$color">Distance: {checkpoint.approx_distance} km</Text>
                    </YStack>
                  </Card.Header>
                </Card>
              </Callout>
            </Marker>
          ))}
        </MapView>
      </View>

      {/* Location Details */}
      <ScrollView>
        <YStack p="$4" space="$4">
          <Card bordered size="$4" animation="bouncy">
            <Card.Header padded>
              <H2>Route Details</H2>
            </Card.Header>
            <Card.Footer padded>
              <XStack space="$4" jc="space-between">
                <XStack space="$2" ai="center">
                  <Footprints size={18} color="$color" />
                  <Text color="$color">{location.steps}</Text>
                </XStack>
                <XStack space="$2" ai="center">
                  <MapPin size={18} color="$color" />
                  <Text color="$color">{location.approx_distance} km</Text>
                </XStack>
              </XStack>
            </Card.Footer>
          </Card>

          <Card bordered size="$4" animation="bouncy">
            <Card.Header padded>
              <H2>Checkpoints</H2>
            </Card.Header>
            <Card.Footer padded>
              <YStack space="$3">
                {location.checkpoints.map((checkpoint) => (
                  <Card key={checkpoint.id} bordered size="$2">
                    <Card.Header padded>
                      <YStack space="$2">
                        <Text fontSize={16} fontWeight="bold" color="$color">
                          {checkpoint.name}
                        </Text>
                        <XStack space="$4" jc="space-between">
                          <XStack space="$2" ai="center">
                            <Text color="$color">{checkpoint.points} points</Text>
                          </XStack>
                          <XStack space="$2" ai="center">
                            <Footprints size={16} color="$color" />
                            <Text color="$color">{checkpoint.steps}</Text>
                            <MapPin size={16} color="$color" />
                            <Text color="$color">{checkpoint.approx_distance} km</Text>
                          </XStack>
                        </XStack>
                      </YStack>
                    </Card.Header>
                  </Card>
                ))}
              </YStack>
            </Card.Footer>
          </Card>
        </YStack>
      </ScrollView>
    </YStack>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    height: Dimensions.get('window').height * 0.4,
    width: '100%',
  },
  map: {
    width: '100%',
    height: '100%',
  }
});

export default EventDetail;