import React from "react";
import { StyleSheet, Dimensions, View } from "react-native";
import {
  YStack,
  XStack,
  Text,
  Button,
  H5,
  Card,
  ScrollView,
  Image,
  useTheme,
} from "tamagui";
import MapView, { Marker, UrlTile, Callout, Polyline } from "react-native-maps";
import {
  Footprints,
  MapPin,
  ChevronLeft,
  Store,
  ChevronRight,
} from "@tamagui/lucide-icons";
import Header from "../components/Header";
import DrawerSceneWrapper from "../components/DrawerSceneWrapper";
import sponsors from "../data/sponsors";
import { TouchableOpacity } from "react-native";
const EventDetail = ({ route, navigation }) => {
  const { location } = route.params;
  const theme = useTheme();

  // Create route coordinates including checkpoints
  const mainRouteCoordinates = [
    { latitude: location.latitude, longitude: location.longitude },
    ...location.checkpoints.map((checkpoint) => ({
      latitude: checkpoint.latitude,
      longitude: checkpoint.longitude,
    })),
    { latitude: location.latitude, longitude: location.longitude }, // Back to start
  ];

  // Find nearby sponsors (within reasonable distance)
  const nearbySponsors = sponsors.filter((sponsor) => {
    const distance = Math.sqrt(
      Math.pow(sponsor.latitude - location.latitude, 2) +
        Math.pow(sponsor.longitude - location.longitude, 2)
    );
    return distance < 0.05; // Roughly 5km radius
  });

  // Create challenge route through sponsors
  const challengeRouteCoordinates =
    nearbySponsors.length > 0
      ? [
          { latitude: location.latitude, longitude: location.longitude },
          // Add first checkpoint
          {
            latitude: location.checkpoints[0].latitude,
            longitude: location.checkpoints[0].longitude,
          },
          // Add nearby sponsors
          ...nearbySponsors.map((sponsor) => ({
            latitude: sponsor.latitude,
            longitude: sponsor.longitude,
          })),
          // Add last checkpoint
          {
            latitude:
              location.checkpoints[location.checkpoints.length - 1].latitude,
            longitude:
              location.checkpoints[location.checkpoints.length - 1].longitude,
          },
          { latitude: location.latitude, longitude: location.longitude },
        ]
      : [];

  // Calculate points and totals for both routes
  const mainRoutePoints = location.checkpoints.reduce(
    (sum, cp) => sum + cp.points,
    0
  );
  const mainRouteSteps = location.checkpoints.reduce(
    (sum, cp) => sum + cp.steps,
    0
  );
  const mainRouteDistance = location.checkpoints.reduce(
    (sum, cp) => sum + cp.approx_distance,
    0
  );

  const challengeRoutePoints = mainRoutePoints + nearbySponsors.length * 50;
  const challengeRouteSteps = mainRouteSteps * 1.5; // 50% more steps for challenge route
  const challengeRouteDistance = mainRouteDistance * 1.5; // 50% more distance for challenge route

  const isEventTime = () => {
    const now = new Date();
    const eventDate = new Date(location.date + " " + location.startTime);
    return now >= eventDate;
  };

  return (
    <DrawerSceneWrapper>
      <YStack f={1} bg="$background">
        <Header navigation={navigation} />
        <ScrollView>
          <YStack p="$3" space="$3">
            {/* Header Section */}
            <XStack ai="center" space="$2">
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <XStack ai="center" space="$2">
                  <ChevronLeft size={20} color={theme.color.val} />
                  <H5 p="$0" color="$color">
                    {location.name}
                  </H5>
                </XStack>
              </TouchableOpacity>
            </XStack>

            {/* Featured Sponsor Card */}
            {nearbySponsors.length > 0 && (
              <Card bordered size="$2" animation="bouncy" width="100%">
                <Card.Footer padded f={1} p="$3" width="100%">
                  <YStack space="$3" width="100%">
                    <XStack space="$3" ai="center" width="100%">
                      <Image
                        source={nearbySponsors[0].logo}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                        }}
                      />
                      <YStack f={1}>
                        <Text fontSize={16} fontWeight="bold" color="$color">
                          {nearbySponsors[0].name}
                        </Text>
                        <Text
                          fontSize={14}
                          color={theme.cyan8.val}
                          fontWeight="bold"
                        >
                          {nearbySponsors[0].discount}
                        </Text>
                      </YStack>
                      <ChevronRight size={20} color={theme.color.val} />
                    </XStack>
                    <Button
                      size="$3"
                      variant="outlined"
                      borderWidth={1}
                      borderColor={theme.color8.val}
                      color={theme.color.val}
                      onPress={() => {
                        navigation.navigate("Store");
                      }}
                      width="100%"
                    >
                      Shop Now to Redeem your Discount
                    </Button>
                  </YStack>
                </Card.Footer>
              </Card>
            )}

            {/* Map Card */}
            <Card bordered size="$2" animation="bouncy">
              <Card.Header padded p="$3">
                <YStack space="$2" width="100%">
                  {/* Route Details Card */}
                  <YStack space="$3" width="100%">
                    {/* Quick Route Details */}
                    <YStack space="$2" width="100%">
                      <XStack space="$2" ai="center">
                        <View
                          style={[
                            styles.routeIndicator,
                            { backgroundColor: theme.magenta7.val },
                          ]}
                        />
                        <Text color="$color" fontSize={14} fontWeight="bold">
                          Quick Route
                        </Text>
                      </XStack>
                      <XStack
                        space="$4"
                        pl="$4"
                        jc="space-between"
                        width="100%"
                      >
                        <XStack space="$2" ai="center">
                          <Footprints size={16} color={theme.magenta7.val} />
                          <Text color="$color" fontSize={14}>
                            {mainRouteSteps} steps
                          </Text>
                        </XStack>
                        <XStack space="$2" ai="center">
                          <MapPin size={16} color={theme.magenta7.val} />
                          <Text color="$color" fontSize={14}>
                            {mainRouteDistance.toFixed(1)} km
                          </Text>
                        </XStack>
                        <XStack space="$2" ai="center">
                          <Text
                            color={theme.magenta7.val}
                            fontSize={14}
                            fontWeight="bold"
                          >
                            {mainRoutePoints} pts
                          </Text>
                        </XStack>
                      </XStack>
                    </YStack>

                    {/* Challenge Route Details */}
                    {challengeRouteCoordinates.length > 0 && (
                      <YStack space="$2" width="100%">
                        <XStack space="$2" ai="center">
                          <View
                            style={[
                              styles.routeIndicator,
                              { backgroundColor: theme.cyan8.val },
                            ]}
                          />
                          <Text color="$color" fontSize={14} fontWeight="bold">
                            Challenge Route
                          </Text>
                        </XStack>
                        <XStack
                          space="$4"
                          pl="$4"
                          jc="space-between"
                          width="100%"
                        >
                          <XStack space="$2" ai="center">
                            <Footprints size={16} color={theme.cyan8.val} />
                            <Text color="$color" fontSize={14}>
                              {Math.round(challengeRouteSteps)} steps
                            </Text>
                          </XStack>
                          <XStack space="$2" ai="center">
                            <MapPin size={16} color={theme.cyan8.val} />
                            <Text color="$color" fontSize={14}>
                              {challengeRouteDistance.toFixed(1)} km
                            </Text>
                          </XStack>
                          <XStack space="$2" ai="center">
                            <Text
                              color={theme.cyan8.val}
                              fontSize={14}
                              fontWeight="bold"
                            >
                              {challengeRoutePoints} pts
                            </Text>
                          </XStack>
                        </XStack>
                        <Text
                          color="$color"
                          fontSize={12}
                          opacity={0.7}
                          pl="$4"
                        >
                          Includes {nearbySponsors.length} sponsor
                          {nearbySponsors.length > 1 ? "s" : ""} (+
                          {nearbySponsors.length * 50} bonus points)
                        </Text>
                      </YStack>
                    )}
                  </YStack>
                </YStack>
              </Card.Header>

              <Card.Footer padded f={1} p="$3" width="100%">
                <View style={styles.mapContainer}>
                  <MapView
                    style={styles.map}
                    mapType="mutedStandard"
                    userInterfaceStyle={theme.isDark ? "dark" : "light"}
                    initialRegion={{
                      latitude: location.latitude,
                      longitude: location.longitude,
                      latitudeDelta: 0.02,
                      longitudeDelta: 0.02,
                    }}
                  >
                    <UrlTile
                      urlTemplate={
                        theme.isDark
                          ? "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
                          : "https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
                      }
                      shouldReplaceMapContent={true}
                      maximumZ={19}
                      flipY={false}
                    />

                    {/* Main Route Polyline */}
                    <Polyline
                      coordinates={mainRouteCoordinates}
                      strokeColor={theme.magenta7.val}
                      strokeWidth={3}
                      geodesic={true}
                      lineDashPattern={[1]}
                      lineCap="round"
                      lineJoin="round"
                    />

                    {/* Challenge Route Polyline */}
                    {challengeRouteCoordinates.length > 0 && (
                      <Polyline
                        coordinates={challengeRouteCoordinates}
                        strokeColor={theme.cyan8.val}
                        strokeWidth={3}
                        geodesic={true}
                        lineDashPattern={[1]}
                        lineCap="round"
                        lineJoin="round"
                      />
                    )}

                    {/* Main location marker */}
                    <Marker
                      coordinate={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                      }}
                      pinColor={theme.magenta7.val}
                    >
                      <Callout>
                        <View style={styles.calloutContainer}>
                          <Text
                            style={[
                              styles.calloutTitle,
                              { color: theme.color.val },
                            ]}
                          >
                            {location.name}
                          </Text>
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
                        pinColor={theme.lime7.val}
                      >
                        <Callout>
                          <View style={styles.calloutContainer}>
                            <Text
                              style={[
                                styles.calloutTitle,
                                { color: theme.color.val },
                              ]}
                            >
                              {checkpoint.name}
                            </Text>
                            <Text
                              style={[
                                styles.calloutText,
                                { color: theme.color.val },
                              ]}
                            >
                              {checkpoint.points} points • {checkpoint.steps}{" "}
                              steps
                            </Text>
                            <Text
                              style={[
                                styles.calloutText,
                                { color: theme.color.val },
                              ]}
                            >
                              Distance: {checkpoint.approx_distance} km
                            </Text>
                          </View>
                        </Callout>
                      </Marker>
                    ))}

                    {/* Nearby Sponsor markers */}
                    {nearbySponsors.map((sponsor) => (
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
                        <Callout>
                          <View style={styles.calloutContainer}>
                            <Text
                              style={[
                                styles.calloutTitle,
                                { color: theme.color.val },
                              ]}
                            >
                              {sponsor.name}
                            </Text>
                            <Text
                              style={[
                                styles.calloutText,
                                { color: theme.cyan8.val },
                              ]}
                            >
                              {sponsor.discount} • +50 points
                            </Text>
                          </View>
                        </Callout>
                      </Marker>
                    ))}

                    {/* Circle markers for start/end point */}
                    <Marker
                      coordinate={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                      }}
                      anchor={{ x: 0.5, y: 0.5 }}
                    >
                      <View
                        style={[
                          styles.startEndMarker,
                          { borderColor: theme.magenta7.val },
                        ]}
                      >
                        <View
                          style={[
                            styles.startEndMarkerInner,
                            { backgroundColor: theme.magenta7.val },
                          ]}
                        />
                      </View>
                    </Marker>
                  </MapView>
                </View>
              </Card.Footer>
            </Card>

            {/* Checkpoints Card */}
            <Card bordered size="$2" animation="bouncy" width="100%">
              <Card.Header padded p="$3" width="100%">
                <H5 color="$color">Checkpoints</H5>
              </Card.Header>
              <Card.Footer padded p="$3" width="100%">
                <YStack space="$2" width="100%">
                  {location.checkpoints.map((checkpoint) => (
                    <Card key={checkpoint.id} bordered size="$1" width="100%">
                      <Card.Header padded p="$2" width="100%">
                        <YStack space="$1" width="100%">
                          <Text fontSize={14} fontWeight="bold" color="$color">
                            {checkpoint.name}
                          </Text>
                          <XStack space="$3" jc="space-between" width="100%">
                            <XStack space="$2" ai="center">
                              <Text
                                color={theme.cyan7.val}
                                fontWeight="bold"
                                fontSize={12}
                              >
                                {checkpoint.points} points
                              </Text>
                            </XStack>
                            <XStack space="$2" ai="center">
                              <Footprints
                                size={14}
                                color={theme.magenta7.val}
                              />
                              <Text color="$color" fontSize={12}>
                                {checkpoint.steps} steps
                              </Text>
                              <MapPin size={14} color={theme.lime7.val} />
                              <Text color="$color" fontSize={12}>
                                {checkpoint.approx_distance} km
                              </Text>
                            </XStack>
                          </XStack>
                        </YStack>
                      </Card.Header>
                    </Card>
                  ))}
                </YStack>
              </Card.Footer>
            </Card>

            {/* Event Timing Card */}
            <Card bordered size="$2" animation="bouncy" width="100%">
              <Card.Header padded p="$3" width="100%">
                <H5 color="$color">Event Timing</H5>
              </Card.Header>
              <Card.Footer padded p="$3" width="100%">
                <YStack space="$3" width="100%">
                  <XStack space="$4" jc="space-between" width="100%">
                    <YStack>
                      <Text color="$color" opacity={0.7} fontSize={12}>
                        Date
                      </Text>
                      <Text color="$color" fontSize={16} fontWeight="bold">
                        {location.date}
                      </Text>
                    </YStack>
                    <YStack>
                      <Text color="$color" opacity={0.7} fontSize={12}>
                        Start Time
                      </Text>
                      <Text color="$color" fontSize={16} fontWeight="bold">
                        {location.startTime}
                      </Text>
                    </YStack>
                  </XStack>

                  <Button
                    size="$4"
                    theme={isEventTime() ? "active" : "gray"}
                    disabled={!isEventTime()}
                    onPress={() => {
                      // Handle start event
                      navigation.navigate("ActiveEvent", { location });
                    }}
                    width="100%"
                  >
                    {isEventTime() ? "Start Event" : "Event Not Started"}
                  </Button>
                </YStack>
              </Card.Footer>
            </Card>
          </YStack>
        </ScrollView>
      </YStack>
    </DrawerSceneWrapper>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    height: Dimensions.get("window").height * 0.25,
    width: "100%",
  },
  map: {
    width: "100%",
    height: "100%",
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
  routeIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  sponsorMarker: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
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
    width: "100%",
    height: "100%",
    borderRadius: 25,
  },
  startEndMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  startEndMarkerInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default EventDetail;
