import React from 'react';
import { StyleSheet, Dimensions, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { YStack, XStack, Text, Button } from 'tamagui';
import MapView, { Marker, UrlTile, Callout } from 'react-native-maps';
import { ChevronLeft } from '@tamagui/lucide-icons';

const EventDetail = ({ route, navigation }) => {
  const { location } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <YStack f={1}>
        {/* Header */}
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
                <View style={styles.calloutContainer}>
                  <Text style={styles.calloutTitle}>{location.name}</Text>
                  <Text style={styles.calloutDescription}>
                    Total Steps: {location.steps} • Distance: {location.approx_distance} km
                  </Text>
                </View>
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
                  <View style={styles.calloutContainer}>
                    <Text style={styles.calloutTitle}>{checkpoint.name}</Text>
                    <Text style={styles.calloutDescription}>
                      {checkpoint.points} points • {checkpoint.steps} steps
                    </Text>
                    <Text style={styles.calloutDescription}>
                      Distance: {checkpoint.approx_distance} km
                    </Text>
                  </View>
                </Callout>
              </Marker>
            ))}
          </MapView>
        </View>

        {/* Location Details */}
        <YStack p="$4" space="$4">
          <Text fontSize={16} fontWeight="bold">Route Details</Text>
          <XStack space="$4">
            <Text>Total Steps: {location.steps}</Text>
            <Text>Distance: {location.approx_distance} km</Text>
          </XStack>
          <Text fontSize={16} fontWeight="bold">Checkpoints</Text>
          {location.checkpoints.map((checkpoint) => (
            <XStack key={checkpoint.id} space="$2">
              <Text>{checkpoint.name}:</Text>
              <Text>{checkpoint.points} points</Text>
              <Text>•</Text>
              <Text>{checkpoint.steps} steps</Text>
            </XStack>
          ))}
        </YStack>
      </YStack>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  mapContainer: {
    height: Dimensions.get('window').height * 0.4,
    width: '100%',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  calloutContainer: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 8,
    padding: 12,
    maxWidth: 200,
  },
  calloutTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  calloutDescription: {
    color: 'white',
    fontSize: 14,
    marginBottom: 4,
  },
});

export default EventDetail;