import React, { useState, forwardRef, useImperativeHandle } from "react";
import { View, StyleSheet, Dimensions, Text, TouchableOpacity } from "react-native";
import MapView, { UrlTile, Marker, Callout } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import locations from "../data/locations";

const Map = forwardRef((props, ref) => {
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useImperativeHandle(ref, () => ({
    // Add any methods you want to expose to the parent component here
  }));

  const handleCalloutPress = (location) => {
    navigation.navigate('Events', {
      screen: 'EventDetail',
      params: { location }
    });
  };

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error loading map: {error}</Text>
      </View>
    );
  }

  return (
    <View>
      <MapView
        mapType="mutedStandard" 
        userInterfaceStyle="dark"
        style={styles.map}
        initialRegion={{
          latitude: 29.3759,
          longitude: 47.9774,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onError={(error) => setError(error.nativeEvent.error)}
      >
        <UrlTile
          urlTemplate={'https://d.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'}
          shouldReplaceMapContent={true}
          maximumZ={19}
          flipY={false}
        />
        {locations.map((location) => (
          <Marker
            key={location.id}
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
          >
            <Callout
              onPress={() => handleCalloutPress(location)}
              tooltip
            >
              <TouchableOpacity style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>{location.name}</Text>
                <Text style={styles.calloutDescription}>
                  {location.steps} steps • {location.approx_distance} km
                </Text>
                <Text style={styles.calloutHint}>Tap for details</Text>
              </TouchableOpacity>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
});

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
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
  calloutHint: {
    color: '#aaa',
    fontSize: 12,
    fontStyle: 'italic',
  },
});

export default Map;
