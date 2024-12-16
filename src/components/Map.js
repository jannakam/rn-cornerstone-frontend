import React, { useState, forwardRef, useImperativeHandle } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import MapView, { UrlTile, Marker, Callout } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import { Card, YStack, XStack, useTheme } from "tamagui";
import { Footprints, MapPin } from "@tamagui/lucide-icons";
import locations from "../data/locations";
import sponsors from "../data/sponsors";

const Map = forwardRef((props, ref) => {
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const theme = useTheme();
  const { isDark } = theme;

  useImperativeHandle(ref, () => ({
    // Add any methods you want to expose to the parent component here
  }));

  const handleCalloutPress = (location) => {
    navigation.navigate("Events", {
      screen: "EventDetail",
      params: { location },
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
        userInterfaceStyle={isDark ? "dark" : "light"}
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
          urlTemplate={
            isDark
            ? "https://d.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png" 
            : "https://d.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
          }
          shouldReplaceMapContent={true}
          maximumZ={19}
          flipY={false}
        />
        {/* Event Locations */}
        {locations.map((location) => (
          <Marker
            key={location.id}
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            pinColor={theme.magenta7.val}
            title={location.name}
            description={`${location.steps} steps • ${location.approx_distance}km`}
          >
            <Callout onPress={() => handleCalloutPress(location)}>
              <View style={styles.calloutContainer} >
                <Text style={[styles.calloutTitle, { color: 'black' }]}>
                  {location.name}
                </Text>
                <XStack space="$2" ai="center">
                  <Footprints size={16} color={theme.magenta7.val} />
                  <Text
                    style={[styles.calloutText, { color: 'black' }]}
                  >
                    {location.steps} steps
                  </Text>
                  <MapPin size={16} color={theme.lime7.val} />
                  <Text
                    style={[styles.calloutText, { color: 'black' }]}
                  >
                    {location.approx_distance}km
                  </Text>
                </XStack>
              </View>
            </Callout>
          </Marker>
        ))}

        {/* Sponsor Locations */}
        {sponsors.map((sponsor) => (
          <Marker
            key={sponsor.id}
            coordinate={{
              latitude: sponsor.latitude,
              longitude: sponsor.longitude,
            }}
            title={sponsor.name}
            description={sponsor.discount}
          >
            <View style={[styles.sponsorMarker, { borderColor: theme.cyan7.val }]}>
              <Image
                source={sponsor.logo}
                style={styles.sponsorLogo}
                resizeMode="contain"
              />
            </View>
            <Callout>
              <View style={styles.calloutContainer}>
                <Text style={[styles.calloutTitle, { color: 'black' }]}>
                  {sponsor.name}
                </Text>
                <Text style={[styles.calloutText, { color: theme.cyan8.val }]}>
                  {sponsor.discount}
                </Text>
              </View>
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
  sponsorMarker: {
    backgroundColor: "transparent",
    borderRadius: 30,
    padding: 5,
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sponsorLogo: {
    width: 40,
    height: 40,
    borderRadius: 40,
  },
  calloutContainer: {
    padding: 10,
    minWidth: 200,

  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  calloutText: {
    fontSize: 14,
  },
});

export default Map;
