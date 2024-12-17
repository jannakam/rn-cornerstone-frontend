import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { StyleSheet, Dimensions, View, Alert } from "react-native";
import { YStack, XStack, Text, Button, Card, useTheme } from "tamagui";
import MapView, {
  Marker,
  Polyline,
  Circle,
  Callout,
  UrlTile,
} from "react-native-maps";
import {
  Camera as CameraIcon,
  ChevronLeft,
  Award,
  Timer,
  Footprints,
  Crosshair,
  Route,
} from "@tamagui/lucide-icons";
import * as Location from "expo-location";
import { useCameraPermissions, CameraView } from "expo-camera";
import { Pedometer } from "expo-sensors";
import {
  createEventChallenge,
  participateInEvent,
  updateStepsForEvent,
  getUserProfile,
  updateUser,
  getAllEventChallenges,
} from "../api/Auth"; // Ensure correct path

const CHECKPOINT_RADIUS = 150;
const INTERACTION_RADIUS = 1000;

const CustomCallout = React.memo(({ checkpoint, theme }) => (
  <Card
    backgroundColor="$background"
    borderRadius="$4"
    padding="$4"
    elevation={4}
    borderColor="$borderColor"
  >
    <YStack space="$2">
      <Text color="$color" fontWeight="bold" fontSize="$5">
        {checkpoint.name}
      </Text>
      <XStack space="$3" ai="center">
        <XStack space="$2" ai="center">
          <Award size={16} color={theme.cyan7.val} />
          <Text color="$color">{checkpoint.points} points</Text>
        </XStack>
        <XStack space="$2" ai="center">
          <Footprints size={16} color={theme.magenta7.val} />
          <Text color="$color">{checkpoint.steps} steps</Text>
        </XStack>
      </XStack>
    </YStack>
  </Card>
));

const generateTestCheckpoints = (userLocation) => {
  if (!userLocation) return [];
  return [
    {
      id: "test1",
      name: "Test Checkpoint 1",
      latitude: userLocation.latitude + 0.0002,
      longitude: userLocation.longitude + 0.0002,
      points: 100,
      steps: 500,
    },
    {
      id: "test2",
      name: "Test Checkpoint 2",
      latitude: userLocation.latitude - 0.0002,
      longitude: userLocation.longitude + 0.0002,
      points: 200,
      steps: 1000,
    },
    {
      id: "test3",
      name: "Test Checkpoint 3",
      latitude: userLocation.latitude,
      longitude: userLocation.longitude + 0.0003,
      points: 300,
      steps: 1500,
    },
  ];
};

const ActiveEvent = ({ route, navigation }) => {
  const {
    location,
    isActive: wasActive,
    currentTime,
    currentPoints,
    currentSteps,
  } = route.params;
  const theme = useTheme();
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyCheckpoint, setNearbyCheckpoint] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [selectedCheckpoint, setSelectedCheckpoint] = useState(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [elapsedTime, setElapsedTime] = useState(currentTime || 0);
  const [points, setPoints] = useState(currentPoints || 0);
  const [steps, setSteps] = useState(currentSteps || 0);
  const [isActive, setIsActive] = useState(true);
  const [eventId, setEventId] = useState(null);
  const timerRef = useRef(null);
  const locationSubscription = useRef(null);
  const [isFollowingUser, setIsFollowingUser] = useState(false);
  const mapRef = useRef(null);
  const [fixedCheckpoints, setFixedCheckpoints] = useState([]);
  const hasCreatedCheckpoints = useRef(false);
  const [availableRoutes, setAvailableRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [testCheckpoints, setTestCheckpoints] = useState([]);
  const stepSubscription = useRef(null);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isActive]);

  // Setup Pedometer without resetting steps
  useEffect(() => {
    startPedometer();
    return () => {
      if (stepSubscription.current) {
        stepSubscription.current.remove();
      }
    };
  }, []);

  const startPedometer = async () => {
    const isAvailable = await Pedometer.isAvailableAsync();
    if (!isAvailable) {
      console.log("Pedometer not available.");
      return;
    }

    // Start from the current steps (don't reset)
    const initialSteps = currentSteps || 0;
    setSteps(initialSteps);

    // Watch step count increments since the subscription started
    stepSubscription.current = Pedometer.watchStepCount((result) => {
      // Add new steps to our existing count
      setSteps((prev) => prev + result.steps);
    });
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Add this new effect to log points changes
  useEffect(() => {
    console.log("Current points:", points);
  }, [points]);

  const handleEndEvent = async () => {
    Alert.alert("End Event", "Are you sure you want to end this event?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "End",
        onPress: async () => {
          setIsActive(false);
          clearInterval(timerRef.current);
          try {
            if (eventId) {
              // First update the steps for this event
              await updateStepsForEvent(eventId, Math.round(steps));

              // Get current user profile
              const userProfile = await getUserProfile();
              console.log("Current user profile:", {
                totalPoints: userProfile.points,
                totalSteps: userProfile.totalSteps
              });
              console.log("Event earnings:", {
                points,
                steps
              });
              
              // Calculate new totals
              const currentPoints = parseInt(userProfile.points) || 0;
              const currentTotalSteps = parseInt(userProfile.totalSteps) || 0;
              const earnedPoints = parseInt(points) || 0;
              const earnedSteps = parseInt(steps) || 0;
              
              const updatedPoints = currentPoints + earnedPoints;
              const updatedTotalSteps = currentTotalSteps + earnedSteps;
              
              console.log("Final calculations:", {
                currentPoints,
                earnedPoints,
                updatedPoints,
                currentTotalSteps,
                earnedSteps,
                updatedTotalSteps
              });

              // Update user profile with new totals
              if (!isNaN(updatedPoints) && !isNaN(updatedTotalSteps) && 
                  updatedPoints >= 0 && updatedTotalSteps >= 0) {
                await updateUser({ 
                  points: updatedPoints,
                  totalSteps: updatedTotalSteps
                });
                console.log("Successfully updated profile:", {
                  points: updatedPoints,
                  totalSteps: updatedTotalSteps
                });
              } else {
                console.error("Invalid calculations:", { 
                  updatedPoints,
                  updatedTotalSteps
                });
              }
            }
          } catch (err) {
            console.error("Error ending event:", err);
          }

          navigation.navigate("Events", {
            screen: "EventDetail",
            params: {
              location,
              isActive: false,
              currentTime: 0,
              currentPoints: 0,
              currentSteps: 0,
            },
          });
        },
        style: "destructive",
      },
    ]);
  };

  useEffect(() => {
    setupLocationTracking();
    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
    };
  }, []);

  const setupLocationTracking = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is required for this feature."
        );
        return;
      }

      const initialPosition = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const newTestCheckpoints = generateTestCheckpoints({
        latitude: initialPosition.coords.latitude,
        longitude: initialPosition.coords.longitude,
      });

      setTestCheckpoints(newTestCheckpoints);
      setUserLocation(initialPosition.coords);

      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 1,
        },
        (loc) => {
          setUserLocation(loc.coords);
        }
      );
    } catch (err) {
      console.log("Failed to setup location tracking:", err);
      Alert.alert(
        "Pedometer Error",
        "Failed to access step counter. Please make sure you have granted the necessary permissions.",
        [{ text: "OK" }]
      );
    }
  };

  // Update steps in backend periodically
  useEffect(() => {
    if (!eventId || !isActive) return;

    const updateInterval = setInterval(async () => {
      try {
        await updateStepsForEvent(eventId, Math.round(steps));
      } catch (err) {
        console.error("Error updating steps:", err);
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(updateInterval);
  }, [eventId, steps, isActive]);

  // Create Event and Participate if not done
  useEffect(() => {
    const initiateEvent = async () => {
      if (!eventId) {
        try {
          // First check if event already exists for this location
          const existingEvents = await getAllEventChallenges();
          const existingEvent = existingEvents?.find(event => event.name === location.name);
          
          if (existingEvent) {
            // If event exists, just set the ID and participate
            setEventId(existingEvent.id);
            await participateInEvent(existingEvent.id);
          } else {
            // Calculate total fixed points from all checkpoints
            const totalFixedPoints = location.checkpoints.reduce((sum, checkpoint) => sum + checkpoint.points, 0);

            // If no existing event, create a new one
            const eventData = {
              name: location.name,
              checkpoints: location.checkpoints,
              basePoints: 100,
              fixedPoints: totalFixedPoints, // Add fixed points from checkpoints
            };

            const createdEvent = await createEventChallenge(eventData);
            if (createdEvent?.id) {
              setEventId(createdEvent.id);
              await participateInEvent(createdEvent.id);
            } else {
              console.error("No event ID received from createEventChallenge");
            }
          }
        } catch (err) {
          console.error("Error creating/participating in event:", err);
        }
      }
    };

    if (isActive) {
      initiateEvent();
    }
  }, [isActive, eventId, location]);

  useEffect(() => {
    if (userLocation && !hasCreatedCheckpoints.current) {
      const newCheckpoints = [
        {
          id: "fixed1",
          name: "Checkpoint Alpha",
          latitude: userLocation.latitude + 0.0002,
          longitude: userLocation.longitude + 0.0002,
          points: 100,
          steps: 500,
        },
        {
          id: "fixed2",
          name: "Checkpoint Beta",
          latitude: userLocation.latitude - 0.0002,
          longitude: userLocation.longitude + 0.0002,
          points: 200,
          steps: 1000,
        },
        {
          id: "fixed3",
          name: "Checkpoint Gamma",
          latitude: userLocation.latitude,
          longitude: userLocation.longitude + 0.0003,
          points: 300,
          steps: 1500,
        },
      ];
      setFixedCheckpoints(newCheckpoints);
      hasCreatedCheckpoints.current = true;
    }
  }, [userLocation]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const generateIntermediatePoints = (start, end, numPoints = 3) => {
    const points = [];
    for (let i = 1; i <= numPoints; i++) {
      const ratio = i / (numPoints + 1);
      const lat = start.latitude + (end.latitude - start.latitude) * ratio;
      const lng = start.longitude + (end.longitude - start.longitude) * ratio;

      const latOffset = (Math.random() - 0.5) * 0.0002;
      const lngOffset = (Math.random() - 0.5) * 0.0002;

      points.push({
        latitude: lat + latOffset,
        longitude: lng + lngOffset,
      });
    }
    return points;
  };

  const generateRouteToCheckpoint = (start, end) => {
    const intermediatePoints = generateIntermediatePoints(start, end);
    return [start, ...intermediatePoints, end];
  };

  const generateRouteSegments = (userLocation, checkpoints) => {
    if (!userLocation || !checkpoints.length) return [];

    const segments = [];
    let currentPoint = {
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
    };

    checkpoints.forEach((checkpoint) => {
      const routePoints = generateRouteToCheckpoint(currentPoint, {
        latitude: checkpoint.latitude,
        longitude: checkpoint.longitude,
      });
      segments.push(routePoints);
      currentPoint = {
        latitude: checkpoint.latitude,
        longitude: checkpoint.longitude,
      };
    });

    return segments;
  };

  const handleOpenCamera = useCallback(
    async (checkpoint) => {
      if (!checkpoint) return;
      try {
        if (!permission?.granted) {
          const { granted } = await requestPermission();
          if (!granted) return;
        }
        setSelectedCheckpoint(checkpoint);
        setShowCamera(true);
      } catch (err) {
        Alert.alert("Error", "Failed to open camera: " + err.message);
      }
    },
    [permission, requestPermission]
  );

  const checkNearbyCheckpoints = useCallback(
    (userCoords) => {
      const allCheckpoints = [
        ...(location?.checkpoints || []),
        ...testCheckpoints,
        ...fixedCheckpoints,
      ];
      const checkpointInRange = allCheckpoints.find((checkpoint) => {
        const distance = calculateDistance(
          userCoords.latitude,
          userCoords.longitude,
          checkpoint.latitude,
          checkpoint.longitude
        );
        return distance <= CHECKPOINT_RADIUS;
      });

      if (
        checkpointInRange &&
        (!nearbyCheckpoint || nearbyCheckpoint.id !== checkpointInRange.id)
      ) {
        setNearbyCheckpoint(checkpointInRange);
      } else if (!checkpointInRange) {
        setNearbyCheckpoint(null);
      }
    },
    [location?.checkpoints, testCheckpoints, fixedCheckpoints, nearbyCheckpoint]
  );

  useEffect(() => {
    if (userLocation && testCheckpoints.length && fixedCheckpoints.length) {
      checkNearbyCheckpoints(userLocation);
    }
  }, [userLocation, testCheckpoints, fixedCheckpoints, checkNearbyCheckpoints]);

  const handleCheckpointPress = (checkpoint) => {
    if (!userLocation) {
      Alert.alert("Error", "Waiting for location...");
      return;
    }

    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      checkpoint.latitude,
      checkpoint.longitude
    );

    if (distance <= INTERACTION_RADIUS) {
      handleOpenCamera(checkpoint);
    } else {
      Alert.alert(
        "Too Far",
        "You need to be within 1km of the checkpoint to interact with it."
      );
    }
  };

  const markers = useMemo(() => {
    const allCheckpoints = [
      ...(location.checkpoints || []),
      ...fixedCheckpoints,
    ];
    return allCheckpoints.map((checkpoint) => (
      <Marker
        key={`marker-${checkpoint.id}`}
        coordinate={{
          latitude: checkpoint.latitude,
          longitude: checkpoint.longitude,
        }}
        zIndex={3}
      >
        <Callout tooltip>
          <CustomCallout checkpoint={checkpoint} theme={theme} />
        </Callout>
      </Marker>
    ));
  }, [location.checkpoints, fixedCheckpoints, theme]);

  const handleCenterOnUser = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );
      setIsFollowingUser(true);
    }
  };

  const handleBack = () => {
    // Navigate back to EventDetail with current state
    navigation.navigate("Events", {
      screen: "EventDetail",
      params: {
        location,
        isActive: true,
        currentTime: elapsedTime,
        currentPoints: points,
        currentSteps: steps,
      },
    });
  };

  const generateRoutes = useCallback(
    (checkpoints) => {
      if (!userLocation || !checkpoints?.length) return [];

      const routes = [
        {
          id: "direct",
          name: "Direct Route",
          checkpoints: [...checkpoints].sort((a, b) => {
            const distA = calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              a.latitude,
              a.longitude
            );
            const distB = calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              b.latitude,
              b.longitude
            );
            return distA - distB;
          }),
          color: theme.magenta7.val,
          totalDistance: 0,
        },
        {
          id: "circular",
          name: "Circular Route",
          checkpoints: [...checkpoints].sort((a, b) => {
            const angleA = Math.atan2(
              a.latitude - userLocation.latitude,
              a.longitude - userLocation.longitude
            );
            const angleB = Math.atan2(
              b.latitude - userLocation.latitude,
              b.longitude - userLocation.longitude
            );
            return angleA - angleB;
          }),
          color: theme.cyan8.val,
          totalDistance: 0,
        },
        {
          id: "zigzag",
          name: "Challenge Route",
          checkpoints: checkpoints.reduce((acc, checkpoint, i) => {
            const position = i % 2 === 0 ? "push" : "unshift";
            acc[position](checkpoint);
            return acc;
          }, []),
          color: theme.lime7.val,
          totalDistance: 0,
        },
      ];

      routes.forEach((route) => {
        let totalDist = 0;
        for (let i = 0; i < route.checkpoints.length - 1; i++) {
          totalDist += calculateDistance(
            route.checkpoints[i].latitude,
            route.checkpoints[i].longitude,
            route.checkpoints[i + 1].latitude,
            route.checkpoints[i + 1].longitude
          );
        }
        route.totalDistance = totalDist / 1000;
      });

      return routes;
    },
    [userLocation, theme]
  );

  useEffect(() => {
    if (userLocation) {
      const allCheckpoints = [
        ...(location?.checkpoints || []),
        ...testCheckpoints,
      ];
      const newRoutes = generateRoutes(allCheckpoints);
      setAvailableRoutes(newRoutes);
      if (!selectedRoute && newRoutes.length > 0) {
        setSelectedRoute(newRoutes[0]);
      }
    }
  }, [
    userLocation,
    location?.checkpoints,
    testCheckpoints,
    generateRoutes,
    selectedRoute,
  ]);

  const RouteSelector = () => (
    <Card
      elevation={4}
      backgroundColor="$background"
      padding="$4"
      borderRadius={15}
      borderColor="$borderColor"
      position="absolute"
      top={100}
      right={20}
      zIndex={1005}
      width="90%"
    >
      <YStack space="$2">
        {availableRoutes.map((route) => (
          <Button
            key={route.id}
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
            {route.name} ({route.totalDistance.toFixed(2)}km)
          </Button>
        ))}
      </YStack>
    </Card>
  );

  // Modify the camera capture button handler
  const handleCapturePhoto = () => {
    const checkpointPoints = selectedCheckpoint?.points || 0;
    const newPoints = points + checkpointPoints;
    console.log("Capturing photo, adding points:", {
      currentPoints: points,
      checkpointPoints,
      newTotal: newPoints
    });
    setPoints(newPoints);
    setShowCamera(false);
    setSelectedCheckpoint(null);
  };

  return (
    <YStack f={1} bg="$background">
      {showCamera ? (
        <View style={styles.container}>
          <CameraView style={styles.camera}>
            <Text
              marginTop={400}
              marginLeft={20}
              marginRight={20}
              textAlign="center"
              fontSize="$8"
              fontWeight="bold"
              color="$color"
            >
              You made it to {selectedCheckpoint?.name}!
            </Text>
            <Text
              marginLeft={20}
              marginRight={20}
              textAlign="center"
              fontSize="$4"
              fontWeight="bold"
              color="$color"
            >
              Take a photo to earn {selectedCheckpoint?.points} points.
            </Text>
            <XStack
              position="absolute"
              top={50}
              left={20}
              right={20}
              jc="space-between"
              ai="center"
            >
              <Button
                size="$5"
                icon={ChevronLeft}
                onPress={() => {
                  setShowCamera(false);
                  setSelectedCheckpoint(null);
                }}
                backgroundColor="transparent"
                color="$color"
                p="$0"
                paddingHorizontal="$2"
              />
            </XStack>
            <Button
              size="$3"
              icon={CameraIcon}
              onPress={handleCapturePhoto}
              backgroundColor="transparent"
              borderColor={theme.cyan8.val}
              borderWidth={1}
              color={theme.cyan8.val}
              borderRadius="$9"
              w="70%"
              marginTop="75%"
              alignSelf="center"
              elevate
              elevation={4}
            >
              Capture Photo
            </Button>
          </CameraView>
        </View>
      ) : (
        <YStack f={1}>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            showsUserLocation
            followsUserLocation={isFollowingUser}
            onPanDrag={() => setIsFollowingUser(false)}
            userInterfaceStyle={theme.name === "dark" ? "dark" : "light"}
          >
            <UrlTile
              urlTemplate={
                "https://d.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
              }
              shouldReplaceMapContent={true}
              maximumZ={19}
              flipY={false}
            />
            {userLocation && (
              <>
                <Circle
                  center={{
                    latitude: userLocation.latitude,
                    longitude: userLocation.longitude,
                  }}
                  radius={INTERACTION_RADIUS}
                  fillColor={`${theme.cyan7.val}10`}
                  strokeColor={theme.cyan7.val}
                  strokeWidth={1}
                  zIndex={1}
                />

                {generateRouteSegments(userLocation, [
                  ...(location.checkpoints || []),
                  ...fixedCheckpoints,
                ]).map((segment, index) => (
                  <Polyline
                    key={`route-${index}`}
                    coordinates={segment}
                    strokeColor={
                      index < points ? theme.lime7.val : theme.magenta7.val
                    }
                    strokeWidth={3}
                    lineDashPattern={[1]}
                    zIndex={2}
                  />
                ))}
              </>
            )}

            {[...(location.checkpoints || []), ...fixedCheckpoints].map(
              (checkpoint) => (
                <Circle
                  key={`circle-${checkpoint.id}`}
                  center={{
                    latitude: checkpoint.latitude,
                    longitude: checkpoint.longitude,
                  }}
                  radius={CHECKPOINT_RADIUS}
                  fillColor={`${theme.magenta7.val}20`}
                  strokeColor={theme.magenta7.val}
                  strokeWidth={2}
                  zIndex={2}
                />
              )
            )}

            {markers}

            {selectedRoute && (
              <Polyline
                coordinates={selectedRoute.checkpoints.map((cp) => ({
                  latitude: cp.latitude,
                  longitude: cp.longitude,
                }))}
                strokeColor={selectedRoute.color}
                strokeWidth={3}
                lineDashPattern={[1]}
              />
            )}

            {testCheckpoints.map((checkpoint) => (
              <React.Fragment key={checkpoint.id}>
                <Marker
                  coordinate={{
                    latitude: checkpoint.latitude,
                    longitude: checkpoint.longitude,
                  }}
                  pinColor={theme.lime7.val}
                >
                  <Callout tooltip>
                    <CustomCallout checkpoint={checkpoint} theme={theme} />
                  </Callout>
                </Marker>
                <Circle
                  center={{
                    latitude: checkpoint.latitude,
                    longitude: checkpoint.longitude,
                  }}
                  radius={CHECKPOINT_RADIUS}
                  fillColor={`${theme.magenta7.val}20`}
                  strokeColor={theme.magenta7.val}
                  strokeWidth={2}
                  zIndex={2}
                />
              </React.Fragment>
            ))}
          </MapView>

          <RouteSelector />

          <Button
            size="$4"
            icon={Crosshair}
            position="absolute"
            top={50}
            right={20}
            backgroundColor={isFollowingUser ? theme.cyan8.val : "$background"}
            color={isFollowingUser ? "white" : "$color"}
            borderColor="$color"
            borderWidth={1}
            onPress={handleCenterOnUser}
            circular
          />

          {/* Bottom Controls Card */}
          <Card
            elevation={4}
            backgroundColor="$background"
            padding="$6"
            borderRadius={0}
            borderColor="$borderColor"
            position="absolute"
            bottom={0}
            width="100%"
            zIndex={1000}
          >
            <YStack space="$4" ai="center" jc="center" w="100%">
              {/* Capture Checkpoint Button (centered) */}
              <Button
                size="$3"
                icon={nearbyCheckpoint ? CameraIcon : null}
                onPress={() => handleOpenCamera(nearbyCheckpoint)}
                backgroundColor={theme.background.val}
                borderColor={theme.cyan8.val}
                borderWidth={1}
                zIndex={10002}
                color={theme.cyan8.val}
                borderRadius="$9"
                scale={1.2}
                w="85%"
                disabled={!nearbyCheckpoint}
                elevate
                elevation={4}
              >
                Capture Checkpoint
              </Button>

              {/* Stats: Time, Points, Steps (centered) */}
              <XStack space="$5" ai="center" jc="center" scale={1.1}>
                <XStack space="$2" ai="center">
                  <Timer size={24} color={theme.cyan7.val} />
                  <Text color="$color" fontSize="$7" fontWeight="bold">
                    {formatTime(elapsedTime)}
                  </Text>
                </XStack>
                <XStack space="$2" ai="center">
                  <Award size={24} color={theme.magenta7.val} />
                  <Text color="$color" fontSize="$7" fontWeight="bold">
                    {points}
                  </Text>
                </XStack>
                <XStack space="$2" ai="center">
                  <Footprints size={24} color={theme.lime7.val} />
                  <Text color="$color" fontSize="$7" fontWeight="bold">
                    {steps}
                  </Text>
                </XStack>
              </XStack>

              {/* Control Buttons: Back and End (centered) */}
              <XStack space="$5" ai="center" jc="space-between" width="100%">
                <Button
                  size="$3"
                  onPress={handleBack}
                  backgroundColor={theme.background.val}
                  color="$color"
                  borderColor="$color"
                  borderWidth={1}
                  borderRadius={20}
                  w="30%"
                  p="$1"
                >
                  Back
                </Button>
                <Button
                  size="$3"
                  onPress={handleEndEvent}
                  backgroundColor={theme.background.val}
                  color="$color"
                  borderColor="$color"
                  borderWidth={1}
                  borderRadius={20}
                  w="30%"
                  p="$1"
                >
                  End
                </Button>
              </XStack>
            </YStack>
          </Card>
        </YStack>
      )}
    </YStack>
  );
};

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  camera: {
    flex: 1,
  },
});

export default ActiveEvent;
