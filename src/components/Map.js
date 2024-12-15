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

const sponsors = [
  {
    id: "nino",
    name: "Nino",
    latitude: 29.672365700662176,
    longitude: 48.01301012758003,
    logo: require("../../assets/sponsors/nino.png"),
  },
  {
    id: "johnny-rockets",
    name: "Johnny Rockets",
    latitude: 29.324108373805114,
    longitude: 48.01570752907756,
    logo: require("../../assets/sponsors/johnny-rockets.png"),
  },
  {
    id: "athletes-foot",
    name: "The Athletes Foot",
    latitude: 29.313038374226238,
    longitude: 47.93779784810193,
    logo: require("../../assets/sponsors/athletes-foot.png"),
  },
  {
    id: "north-face",
    name: "The North Face",
    latitude: 29.313137492553466,
    longitude: 47.9357377510658,
    logo: require("../../assets/sponsors/north-face.png"),
  },
  {
    id: "zo-bakery",
    name: "Zo Bakery",
    latitude: 29.317610856941958,
    longitude: 47.971801749408534,
    logo: require("../../assets/sponsors/zo-bakery.png"),
  },
  {
    id: "nail-station",
    name: "Nail Station",
    latitude: 29.327176950567274,
    longitude: 48.01660532797893,
    logo: require("../../assets/sponsors/nail-station.png"),
  },
  {
    id: "chicster",
    name: "Chicster",
    latitude: 29.32147704031317,
    longitude: 48.01712027616785,
    logo: require("../../assets/sponsors/chicster.png"),
  },
  {
    id: "hbr",
    name: "HBR",
    latitude: 29.319855619555202,
    longitude: 48.01801895761049,
    logo: require("../../assets/sponsors/hbr.png"),
  },
  {
    id: "miss-platinium",
    name: "Miss Platinium",
    latitude: 29.362514527861467,
    longitude: 48.02021575190674,
    logo: require("../../assets/sponsors/miss-platinium.png"),
  },
  {
    id: "diet-care",
    name: "Diet Care",
    latitude: 29.34644554522579,
    longitude: 48.07875892427339,
    logo: require("../../assets/sponsors/diet-care.png"),
  },
  {
    id: "intersport",
    name: "Intersport",
    latitude: 29.33086556834453,
    longitude: 47.93052554656595,
    logo: require("../../assets/sponsors/intersport.png"),
  },
];

const Map = forwardRef((props, ref) => {
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const { isDark } = useTheme();
  const theme = useTheme();

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
          <React.Fragment key={location.id}>
            {/* Main location marker */}
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              pinColor={theme.magenta7.val}
            >
              <Callout onPress={() => handleCalloutPress(location)} tooltip>
                <Card bordered size="$2" bg="$background">
                  <Card.Header padded>
                    <YStack space="$2">
                      <Text
                        style={[
                          styles.calloutTitle,
                          { color: theme.color.val },
                        ]}
                      >
                        {location.name}
                      </Text>
                      <XStack space="$4" ai="center">
                        <XStack space="$2" ai="center">
                          <Footprints size={16} color={theme.magenta7.val} />
                          <Text
                            style={[
                              styles.calloutText,
                              { color: theme.color.val },
                            ]}
                          >
                            {location.steps} steps
                          </Text>
                        </XStack>
                        <XStack space="$2" ai="center">
                          <MapPin size={16} color={theme.lime7.val} />
                          <Text
                            style={[
                              styles.calloutText,
                              { color: theme.color.val },
                            ]}
                          >
                            {location.approx_distance}km
                          </Text>
                        </XStack>
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
                pinColor={theme.lime7.val}
              >
                <Callout tooltip>
                  <Card bordered size="$2" bg="$background">
                    <Card.Header padded>
                      <YStack space="$2">
                        <Text
                          style={[
                            styles.calloutTitle,
                            { color: theme.color.val },
                          ]}
                        >
                          {checkpoint.name}
                        </Text>
                        <XStack space="$2">
                          <Text
                            style={[
                              styles.calloutText,
                              { color: theme.color.val },
                            ]}
                          >
                            {checkpoint.points} points • {checkpoint.steps}{" "}
                            steps
                          </Text>
                        </XStack>
                        <Text
                          style={[
                            styles.calloutText,
                            { color: theme.color.val },
                          ]}
                        >
                          Distance: {checkpoint.approx_distance} km
                        </Text>
                      </YStack>
                    </Card.Header>
                  </Card>
                </Callout>
              </Marker>
            ))}
          </React.Fragment>
        ))}

        {/* Sponsor Locations */}
        {sponsors.map((sponsor) => (
          <Marker
            key={sponsor.id}
            coordinate={{
              latitude: sponsor.latitude,
              longitude: sponsor.longitude,
            }}
          >
            <View style={styles.sponsorMarker}>
              <Image
                source={sponsor.logo}
                style={styles.sponsorLogo}
                resizeMode="contain"
              />
            </View>
            <Callout tooltip>
              <Card bordered size="$2" bg="$background">
                <Card.Header padded>
                  <Text
                    style={[styles.calloutTitle, { color: theme.color.val }]}
                  >
                    {sponsor.name}
                  </Text>
                  <Text
                    style={[styles.calloutText, { color: theme.color.val }]}
                  >
                    Sponsor Location
                  </Text>
                </Card.Header>
              </Card>
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
    backgroundColor: "white",
    borderRadius: 15,
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
    width: 30,
    height: 30,
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
