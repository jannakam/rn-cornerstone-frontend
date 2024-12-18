import React, { useState, forwardRef, useImperativeHandle } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import MapView, { UrlTile, Marker, Callout } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import { Card, YStack, XStack, Text, useTheme, Button } from "tamagui";
import { useTheme as useThemeContext } from "../context/ThemeContext";
import { Footprints, MapPin, ChevronRight, Calendar } from "@tamagui/lucide-icons";
import locations from "../data/locations";
import sponsors from "../data/sponsors";

const Map = forwardRef((props, ref) => {
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const theme = useTheme();
  const { isDark } = useThemeContext();
  const urlTemplate = isDark
    ? "https://d.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
    : "https://d.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png";

  useImperativeHandle(ref, () => ({
    // Add any methods you want to expose to the parent component here
  }));

  const handleCalloutPress = (location) => {
    // Navigate to parent first, then to EventDetail to ensure proper stack navigation
    navigation.getParent().navigate("Events", {
      screen: "EventDetail",
      params: { location }
    });
  };

  const CustomCallout = ({ location }) => (
    <TouchableOpacity onPress={() => handleCalloutPress(location)}>
      <Card
        backgroundColor="$background"
        borderRadius="$4"
        padding="$4"
        elevation={4}
        borderColor="$borderColor"
        borderWidth={1}
        width={250}
      >
        <YStack space="$2">
          <Text color="$color" fontWeight="bold" fontSize="$5">
            {location.name}
          </Text>
          <XStack space="$3" ai="center">
            <XStack space="$2" ai="center">
              <Footprints size={16} color={theme.magenta7.val} />
              <Text color="$color">
                {location.steps} steps
              </Text>
            </XStack>
            <XStack space="$2" ai="center">
              <MapPin size={16} color={theme.lime7.val} />
              <Text color="$color">
                {location.approx_distance}km
              </Text>
            </XStack>
          </XStack>
          <XStack space="$2" ai="center">
            <Calendar size={16} color={theme.cyan7.val} />
            <Text color="$color">
              {location.date} at {location.startTime}
            </Text>
          </XStack>
          <Button
            size="$3"
            backgroundColor={theme.background.val}
            color={theme.cyan8.val}
            borderRadius="$6"
            borderColor={theme.cyan8.val}
            borderWidth={1}
            mt="$2"
          >
            View Details
          </Button>
        </YStack>
      </Card>
    </TouchableOpacity>
  );

  const SponsorCallout = ({ sponsor }) => (
    <Card
      backgroundColor="$background"
      borderRadius="$4"
      padding="$4"
      elevation={4}
      borderColor="$borderColor"
      borderWidth={1}
      width={200}
    >
      <YStack space="$2" ai="center">
        <View style={styles.calloutLogoContainer}>
          <Image
            source={sponsor.logo}
            style={styles.calloutLogo}
            resizeMode="contain"
          />
        </View>
        <Text color="$color" fontWeight="bold" fontSize="$5">
          {sponsor.name}
        </Text>
        <Text color={theme.cyan8.val} fontWeight="bold" fontSize="$6">
          {sponsor.discount}
        </Text>
      </YStack>
    </Card>
  );

  if (error) {
    return (
      <View style={styles.container}>
        <Text color="$magenta8">Error loading map: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
          urlTemplate={urlTemplate}
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
          >
            <View style={[styles.eventMarker, { 
              backgroundColor: theme.background.val,
              borderColor: theme.magenta7.val 
            }]}>
              <MapPin size={24} color={theme.magenta7.val} />
            </View>
            <Callout tooltip onPress={() => handleCalloutPress(location)}>
              <CustomCallout location={location} />
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
          >
            <View style={[styles.sponsorMarker, { 
              backgroundColor: "white",
              borderColor: theme.cyan7.val 
            }]}>
              <Image
                source={sponsor.logo}
                style={styles.sponsorLogo}
                resizeMode="contain"
              />
            </View>
            <Callout tooltip>
              <SponsorCallout sponsor={sponsor} />
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  eventMarker: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sponsorMarker: {
    width: 44,
    height: 44,
    borderRadius: 22,
    padding: 4,
    borderWidth: 2,
    backgroundColor: "white",
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
    width: "100%",
    height: "100%",
    borderRadius: 18,
  },
  calloutLogoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
    padding: 2,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
  },
  calloutLogo: {
    width: "100%",
    height: "100%",
    borderRadius: 28,
  },
});

export default Map;
