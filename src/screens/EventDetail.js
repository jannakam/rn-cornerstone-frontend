import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
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
import MapView, { Marker, UrlTile, Callout, Polyline, Circle } from "react-native-maps";
import {
  Footprints,
  MapPin,
  ChevronLeft,
  Store,
  ChevronRight,
  X,
  Maximize2,
  CameraIcon,
  Play,
  Route,
} from "@tamagui/lucide-icons";
import Header from "../components/Header";
import DrawerSceneWrapper from "../components/DrawerSceneWrapper";
import sponsors from "../data/sponsors";

const generateInvisiblePoints = (start, end, numPoints = 3) => {
  const points = [];
  // Create points that follow approximate road patterns
  for (let i = 1; i <= numPoints; i++) {
    const ratio = i / (numPoints + 1);
    const lat = start.latitude + (end.latitude - start.latitude) * ratio;
    const lng = start.longitude + (end.longitude - start.longitude) * ratio;

    // Add larger offsets to simulate road patterns
    const latOffset = (Math.random() - 0.5) * 0.0005;
    const lngOffset = (Math.random() - 0.5) * 0.0005;

    points.push({
      latitude: lat + latOffset,
      longitude: lng + lngOffset,
    });
  }
  return points;
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

const generateAllPointsPath = (start, checkpoints, sponsors) => {
  const allPoints = [
    start,
    ...checkpoints,
    ...sponsors,
    start // Return to start to complete the loop
  ];
  
  const pathPoints = [];
  for (let i = 0; i < allPoints.length - 1; i++) {
    const current = allPoints[i];
    const next = allPoints[i + 1];
    
    // Add invisible points between each pair of points
    const invisiblePoints = generateInvisiblePoints(
      current,
      next,
      Math.floor(Math.random() * 3) + 2 // 2-4 invisible points
    ).map(point => ({
      ...point,
      // Add slight randomness for more natural path
      latitude: point.latitude + (Math.random() - 0.5) * 0.0002,
      longitude: point.longitude + (Math.random() - 0.5) * 0.0002
    }));
    
    pathPoints.push(current, ...invisiblePoints);
  }
  
  // Add the final point to close the loop
  pathPoints.push(allPoints[allPoints.length - 1]);
  
  return pathPoints;
};

const EventDetail = ({ route, navigation }) => {
  const {
    location,
    isActive = false,
    currentTime = 0,
    currentPoints = 0,
  } = route.params || {};
  const theme = useTheme();
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const mapAnimation = useRef(new Animated.Value(0)).current;
  const modalAnimation = useRef(new Animated.Value(0)).current;
  const mapRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const lastTap = useRef(0);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [availableRoutes, setAvailableRoutes] = useState([]);
  const [allPointsPath, setAllPointsPath] = useState([]);

  const generateRoutes = useCallback((start, checkpoints, sponsors = []) => {
    if (!checkpoints?.length) return [];

    // Direct Route - visits checkpoints in order of proximity
    const directRoute = {
      id: "direct",
      name: "Quick Route",
      color: theme.magenta7.val,
      checkpoints: [...checkpoints].sort((a, b) => {
        const distA = calculateDistance(
          start.latitude,
          start.longitude,
          a.latitude,
          a.longitude
        );
        const distB = calculateDistance(
          start.latitude,
          start.longitude,
          b.latitude,
          b.longitude
        );
        return distA - distB;
      }),
    };

    // Scenic Route - takes a longer path with more curves
    const scenicRoute = {
      id: "scenic",
      name: "Scenic Route",
      color: theme.cyan8.val,
      checkpoints: checkpoints.reduce((acc, cp) => {
        // Add invisible points between checkpoints
        const lastPoint = acc[acc.length - 1] || start;
        const invisiblePoints = generateInvisiblePoints(
          lastPoint,
          cp,
          Math.floor(Math.random() * 3) + 2 // 2-4 invisible points
        );
        return [...acc, ...invisiblePoints, cp];
      }, []),
    };

    // Challenge Route - zigzag pattern with more distance
    const challengeRoute = {
      id: "challenge",
      name: "Challenge Route",
      color: theme.lime7.val,
      checkpoints: checkpoints.reduce((acc, cp, i) => {
        if (i === 0) return [cp];
        // Add more invisible points with larger offsets
        const lastPoint = acc[acc.length - 1];
        const invisiblePoints = generateInvisiblePoints(
          lastPoint,
          cp,
          Math.floor(Math.random() * 4) + 3 // 3-6 invisible points
        ).map(point => ({
          ...point,
          // Add larger random offsets for more zigzag
          latitude: point.latitude + (Math.random() - 0.5) * 0.001,
          longitude: point.longitude + (Math.random() - 0.5) * 0.001
        }));
        return [...acc, ...invisiblePoints, cp];
      }, []),
    };

    return [directRoute, scenicRoute, challengeRoute];
  }, [theme]);

  // Initialize routes
  useEffect(() => {
    const start = {
      latitude: location.latitude,
      longitude: location.longitude,
    };
    const checkpoints = location.checkpoints.map(cp => ({
      latitude: cp.latitude,
      longitude: cp.longitude,
    }));
    const routes = generateRoutes(start, checkpoints, nearbySponsors);
    setAvailableRoutes(routes);
    if (routes.length > 0) {
      setSelectedRoute(routes[0]);
    }
  }, [location, generateRoutes]);

  // Initialize all points path
  useEffect(() => {
    const start = {
      latitude: location.latitude,
      longitude: location.longitude,
    };
    const checkpoints = location.checkpoints.map(cp => ({
      latitude: cp.latitude,
      longitude: cp.longitude,
    }));
    const sponsorPoints = nearbySponsors.map(sponsor => ({
      latitude: sponsor.latitude,
      longitude: sponsor.longitude,
    }));
    
    const path = generateAllPointsPath(start, checkpoints, sponsorPoints);
    setAllPointsPath(path);
  }, [location, nearbySponsors]);

  // Update handleBack function
  const handleBack = () => {
    navigation.getParent().navigate("Home", {
      screen: "HomeScreen",
    });
  };

  // Find nearby sponsors (within reasonable distance)
  const nearbySponsors = sponsors.filter((sponsor) => {
    const distance = Math.sqrt(
      Math.pow(sponsor.latitude - location.latitude, 2) +
        Math.pow(sponsor.longitude - location.longitude, 2)
    );
    return distance < 0.05; // Roughly 5km radius
  });

  const toggleMap = () => {
    const toValue = isMapExpanded ? 0 : 1;
    setIsMapExpanded(!isMapExpanded);

    Animated.parallel([
      Animated.spring(mapAnimation, {
        toValue,
        useNativeDriver: true,
        friction: 8,
        tension: 50,
      }),
      Animated.spring(modalAnimation, {
        toValue,
        useNativeDriver: true,
        friction: 8,
        tension: 50,
      }),
    ]).start();
  };

  const modalStyle = {
    transform: [
      {
        scale: modalAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.1],
        }),
      },
    ],
    opacity: modalAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1],
    }),
  };

  const expandedMapStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.background.val,
    zIndex: isMapExpanded ? 1000 : -1,
    opacity: mapAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
    transform: [
      {
        scale: mapAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0.5, 1],
        }),
      },
    ],
  };

  const handleMapPress = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTap.current < DOUBLE_TAP_DELAY) {
      // Double tap detected
      toggleMap();
    }
    lastTap.current = now;
  };

  const RouteSelector = () => (
    <Card
      elevation={4}
      backgroundColor="$background"
      padding="$4"
      borderRadius={10}
      borderColor="$borderColor"
      position="absolute"
      top={150}
      right={20}
      zIndex={1005}
      width="90%"
    >
      <YStack space="$3">
        {availableRoutes.map((route) => (
          <YStack key={route.id} space="$2">
            <Button
              size="$3"
              backgroundColor={
                selectedRoute?.id === route.id ? route.color : "$background"
              }
              color={selectedRoute?.id === route.id ? "white" : "$color"}
              borderColor={route.color}
              borderWidth={1}
              onPress={() => setSelectedRoute(route)}
              icon={Route}
            >
              {route.name}
            </Button>
            {selectedRoute?.id === route.id && (
              <XStack space="$4" pl="$4" jc="space-between" width="100%">
                <XStack space="$2" ai="center">
                  <Footprints size={16} color={route.color} />
                  <Text color="$color" fontSize={14}>
                    {Math.round(route.checkpoints.length * 500)} steps
                  </Text>
                </XStack>
                <XStack space="$2" ai="center">
                  <MapPin size={16} color={route.color} />
                  <Text color="$color" fontSize={14}>
                    {(route.checkpoints.reduce((sum, cp) => sum + (cp.approx_distance || 0), 0) / 1000).toFixed(1)} km
                  </Text>
                </XStack>
                <XStack space="$2" ai="center">
                  <Text color={route.color} fontSize={14} fontWeight="bold">
                    {route.checkpoints.reduce((sum, cp) => sum + (cp.points || 0), 0)} pts
                  </Text>
                </XStack>
              </XStack>
            )}
          </YStack>
        ))}
      </YStack>
    </Card>
  );

  return (
    <DrawerSceneWrapper>
      <YStack f={1} bg="$background">
        <Header navigation={navigation} />
        <ScrollView scrollEnabled={!isMapExpanded}>
          <YStack p="$3" space="$3">
            {/* Header Section */}
            <XStack ai="center" space="$2">
              <TouchableOpacity onPress={handleBack}>
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
              
                

              <Card.Footer padded f={1} p="$3" width="100%">
                <View style={styles.mapContainer}>
                  <MapView
                    ref={mapRef}
                    style={styles.map}
                    mapType="mutedStandard"
                    userInterfaceStyle="light"
                    initialRegion={{
                      latitude: location.latitude,
                      longitude: location.longitude,
                      latitudeDelta: 0.02,
                      longitudeDelta: 0.02,
                    }}
                    onTouchStart={() => setIsDragging(false)}
                    onPanDrag={() => setIsDragging(true)}
                    onPress={() => !isDragging && handleMapPress()}
                  >
                    <UrlTile
                      urlTemplate="https://d.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
                      shouldReplaceMapContent={true}
                      maximumZ={19}
                      flipY={false}
                    />

                    {/* Add the all-points path with dotted line */}
                    <Polyline
                      coordinates={allPointsPath}
                      strokeColor={theme.color11.val}
                      strokeWidth={2}
                      lineDashPattern={[5, 5]}
                      lineCap="round"
                      lineJoin="round"
                      zIndex={1}
                      opacity={0.3}
                    />

                    {selectedRoute && (
                      <Polyline
                        coordinates={selectedRoute.checkpoints}
                        strokeColor={selectedRoute.color}
                        strokeWidth={3}
                        lineDashPattern={[1]}
                        lineCap="round"
                        lineJoin="round"
                        zIndex={2}
                      />
                    )}

                    {/* Checkpoint circles */}
                    {location.checkpoints.map((checkpoint) => (
                      <Circle
                        key={`circle-${checkpoint.id}`}
                        center={{
                          latitude: checkpoint.latitude,
                          longitude: checkpoint.longitude,
                        }}
                        radius={30}
                        fillColor={`${theme.magenta7.val}20`}
                        strokeColor={theme.magenta7.val}
                        strokeWidth={2}
                        zIndex={2}
                      />
                    ))}

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

                  <TouchableWithoutFeedback onPress={toggleMap}>
                    <View style={styles.expandButton}>
                      <Maximize2 size={20} color={theme.background.val} />
                    </View>
                  </TouchableWithoutFeedback>
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
                    size="$5"
                    theme="active"
                    onPress={() =>
                      navigation.navigate("ActiveEvent", {
                        location,
                        isActive,
                        currentTime,
                        currentPoints,
                      })
                    }
                    width="100%"
                    icon={isActive ? CameraIcon : Play}
                    backgroundColor={theme.background.val}
                    borderColor={theme.cyan8.val}
                    borderWidth={1}
                    color={theme.cyan8.val}
                    mt="$4"
                    borderRadius="$10"
                  >
                    {isActive ? "Resume Event" : "Start Event"}
                  </Button>
                </YStack>
              </Card.Footer>
            </Card>
          </YStack>
        </ScrollView>

        {/* Expanded Map Modal */}
        <Animated.View style={expandedMapStyle}>
          <YStack f={1}>
            <XStack ai="center" p="$3" space="$2" h="15%" alignItems="flex-end">
              <TouchableOpacity
                onPress={toggleMap}
                backgroundColor="transparent"
              >
                <X size="$2" color={"$color"} />
              </TouchableOpacity>
              <H5>{location.name}</H5>
            </XStack>
            <MapView
              style={styles.expandedMap}
              mapType="mutedStandard"
              userInterfaceStyle="light"
              initialRegion={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
              }}
            >
              <UrlTile
                urlTemplate="https://d.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
                shouldReplaceMapContent={true}
                maximumZ={19}
                flipY={false}
              />

              {/* Add the all-points path with dotted line */}
              <Polyline
                coordinates={allPointsPath}
                strokeColor={theme.color11.val}
                strokeWidth={2}
                lineDashPattern={[5, 5]}
                lineCap="round"
                lineJoin="round"
                zIndex={1}
                opacity={0.3}
              />

              {selectedRoute && (
                <Polyline
                  coordinates={selectedRoute.checkpoints}
                  strokeColor={selectedRoute.color}
                  strokeWidth={3}
                  lineDashPattern={[1]}
                  lineCap="round"
                  lineJoin="round"
                  zIndex={2}
                />
              )}

              {/* Checkpoint circles */}
              {location.checkpoints.map((checkpoint) => (
                <Circle
                  key={`circle-${checkpoint.id}`}
                  center={{
                    latitude: checkpoint.latitude,
                    longitude: checkpoint.longitude,
                  }}
                  radius={30}
                  fillColor={`${theme.magenta7.val}20`}
                  strokeColor={theme.magenta7.val}
                  strokeWidth={2}
                  zIndex={2}
                />
              ))}

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
                        { color: theme.background.val },
                      ]}
                    >
                      {location.name}
                    </Text>
                    <XStack space="$2" ai="center">
                      <Footprints size={16} color={theme.magenta7.val} />
                      <Text
                        style={[
                          styles.calloutText,
                          { color: theme.background.val },
                        ]}
                      >
                        {location.steps} steps
                      </Text>
                      <MapPin size={16} color={theme.lime7.val} />
                      <Text
                        style={[
                          styles.calloutText,
                          { color: theme.background.val },
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
                        style={[styles.calloutText, { color: theme.color.val }]}
                      >
                        {checkpoint.points} points • {checkpoint.steps} steps
                      </Text>
                      <Text
                        style={[styles.calloutText, { color: theme.color.val }]}
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
                        style={[styles.calloutText, { color: theme.cyan8.val }]}
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

            {/* Only show RouteSelector in expanded view */}
            <RouteSelector />
          </YStack>
        </Animated.View>
      </YStack>
    </DrawerSceneWrapper>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    height: Dimensions.get("window").height * 0.25,
    width: "100%",
    overflow: "hidden",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  expandedMap: {
    flex: 1,
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
  expandButton: {
    position: "absolute",
    backgroundColor: "white",
    top: 10,
    right: 10,
    borderRadius: 8,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default EventDetail;
