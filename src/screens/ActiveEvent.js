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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createEventChallenge,
  participateInEvent,
  updateStepsForEvent,
  getUserProfile,
  updateUser,
  getAllEventChallenges,
} from "../api/Auth";
import { useActiveEvent } from "../context/ActiveEventContext";
const CHECKPOINT_RADIUS = 30;
const INTERACTION_RADIUS = 30;

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
      name: "Test Checkpoint",
      latitude: userLocation.latitude + 0.0002,
      longitude: userLocation.longitude + 0.0002,
      points: 100,
      steps: 500,
    },
  ];
};

const generateCurvedPath = (start, end, curveIntensity = 0.2) => {
  // Calculate midpoint with offset for curve
  const midX = (start.longitude + end.longitude) / 2;
  const midY = (start.latitude + end.latitude) / 2;

  // Calculate perpendicular offset for control point
  const dx = end.longitude - start.longitude;
  const dy = end.latitude - start.latitude;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Control point offset perpendicular to the line
  const offsetX = -dy * dist * curveIntensity;
  const offsetY = dx * dist * curveIntensity;

  const controlPoint = {
    latitude: midY + offsetY,
    longitude: midX + offsetX,
  };

  // Generate points along the quadratic curve
  const points = [];
  for (let t = 0; t <= 1; t += 0.05) {
    const lat =
      Math.pow(1 - t, 2) * start.latitude +
      2 * (1 - t) * t * controlPoint.latitude +
      Math.pow(t, 2) * end.latitude;
    const lng =
      Math.pow(1 - t, 2) * start.longitude +
      2 * (1 - t) * t * controlPoint.longitude +
      Math.pow(t, 2) * end.longitude;
    points.push({
      latitude: lat,
      longitude: lng,
    });
  }
  return points;
};

const generateRoutePoints = (start, checkpoints) => {
  const points = [];
  let currentPoint = start;

  // Generate curved paths between each point
  checkpoints.forEach((point) => {
    const curvedSegment = generateCurvedPath(currentPoint, point);
    points.push(...curvedSegment);
    currentPoint = point;
  });

  // Return to start for a complete loop
  const finalSegment = generateCurvedPath(currentPoint, start);
  points.push(...finalSegment);

  return points;
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

  // Use context for persistent event data
  const {
    activeEvent,
    eventSteps,
    elapsedTime,
    points,
    startEvent,
    updateEventSteps,
    updatePoints,
    updateTime,
    endEvent,
  } = useActiveEvent();

  const [userLocation, setUserLocation] = useState(null);
  const [nearbyCheckpoint, setNearbyCheckpoint] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [selectedCheckpoint, setSelectedCheckpoint] = useState(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [isActive, setIsActive] = useState(true);
  const [eventId, setEventId] = useState(activeEvent?.id || null);
  const timerRef = useRef(null);
  const locationSubscription = useRef(null);
  const [isFollowingUser, setIsFollowingUser] = useState(false);
  const mapRef = useRef(null);
  const [availableRoutes, setAvailableRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [testCheckpoints, setTestCheckpoints] = useState([]);
  const stepSubscription = useRef(null);

  const queryClient = useQueryClient();

  // Add mutations
  const updateStepsMutation = useMutation({
    mutationFn: async ({ eventId, steps }) => {
      return updateStepsForEvent(eventId, steps);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["userProfile"]);
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data) => {
      return updateUser(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["userProfile"]);
    },
  });

  const createEventMutation = useMutation({
    mutationFn: async (eventData) => {
      // First check if event already exists
      const existingEvents = await getAllEventChallenges();
      const existingEvent = existingEvents?.find(
        (event) => event.name === location.name
      );

      let newEventId;
      if (existingEvent) {
        // If event exists, just participate
        newEventId = existingEvent.id;
        await participateInEvent(newEventId);
        console.log("Participating in existing event:", newEventId);
      } else {
        // Create new event if none exists
        const response = await createEventChallenge(eventData);
        if (response?.id) {
          newEventId = response.id;
          await participateInEvent(newEventId);
          console.log("Created and participating in new event:", newEventId);
        } else {
          throw new Error("Failed to get event ID from creation");
        }
      }
      return newEventId;
    },
  });

  // Initialize event once when component mounts
  useEffect(() => {
    const initializeEvent = async () => {
      if (!activeEvent) {
        try {
          // Calculate total fixed points from all checkpoints
          const totalFixedPoints = location.checkpoints.reduce(
            (sum, checkpoint) => sum + checkpoint.points,
            0
          );

          const eventData = {
            name: location.name,
            checkpoints: location.checkpoints,
            basePoints: 100,
            fixedPoints: totalFixedPoints,
          };

          const newEventId = await createEventMutation.mutateAsync(eventData);

          // Start event in context
          startEvent({
            id: newEventId,
            location: location,
            currentTime: currentTime || 0,
            currentPoints: currentPoints || 0,
            currentSteps: currentSteps || 0,
          });
          setEventId(newEventId);
        } catch (error) {
          console.error("Error initiating event:", error);
          Alert.alert("Error", "Failed to start event. Please try again.", [
            { text: "OK", onPress: () => navigation.goBack() },
          ]);
        }
      }
    };

    initializeEvent();
  }, []); // Empty dependency array since this should only run once

  // Timer effect using context's elapsedTime
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        updateTime((prev) => {
          const newTime = (prev || 0) + 1;
          return newTime;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, updateTime]);

  // Pedometer setup
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

    stepSubscription.current = Pedometer.watchStepCount((result) => {
      const newSteps = eventSteps + result.steps;
      updateEventSteps(newSteps); // Only update steps locally
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

  const handleEndEvent = async () => {
    Alert.alert("End Event", "Are you sure you want to end this event?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "End",
        onPress: async () => {
          try {
            // Stop all active tracking first
            setIsActive(false);
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            if (stepSubscription.current) {
              stepSubscription.current.remove();
            }

            if (eventId) {
              // Get current user profile first
              const userProfile = await getUserProfile();
              const currentPoints = parseInt(userProfile.points) || 0;
              const currentTotalSteps = parseInt(userProfile.totalSteps) || 0;
              const earnedPoints = parseInt(points) || 0;
              const earnedSteps = parseInt(eventSteps) || 0;

              const updatedPoints = currentPoints + earnedPoints;
              const updatedTotalSteps = currentTotalSteps + earnedSteps;

              if (
                !isNaN(updatedPoints) &&
                !isNaN(updatedTotalSteps) &&
                updatedPoints >= 0 &&
                updatedTotalSteps >= 0
              ) {
                try {
                  // First update the event steps and mark as completed
                  await updateStepsMutation.mutateAsync({
                    eventId,
                    steps: Math.round(eventSteps),
                    completed: true, // Set completed flag to true
                  });

                  // Then update the profile
                  await updateProfileMutation.mutateAsync({
                    points: updatedPoints,
                    totalSteps: updatedTotalSteps,
                  });

                  // Only after successful updates, end event and navigate
                  await endEvent();
                  navigation.getParent().navigate("Home", {
                    screen: "HomeScreen",
                  });
                } catch (updateError) {
                  console.error("Error updating data:", updateError);
                  throw new Error("Failed to update event data");
                }
              } else {
                throw new Error("Invalid points or steps calculation");
              }
            } else {
              // If no eventId, just end and navigate
              await endEvent();
              navigation.getParent().navigate("Home", {
                screen: "HomeScreen",
              });
            }
          } catch (err) {
            console.error("Error ending event:", err);
            Alert.alert(
              "Error",
              "Failed to end event. Your progress has been saved, please try again.",
              [{ text: "OK" }]
            );
            // Restore active state if error
            setIsActive(true);
            startPedometer();
          }
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

  const generateInvisiblePoints = (start, end, numPoints = 3) => {
    const points = [];
    // Create points that follow approximate road patterns
    // Add slight offsets to create more natural paths
    for (let i = 1; i <= numPoints; i++) {
      const ratio = i / (numPoints + 1);
      const lat = start.latitude + (end.latitude - start.latitude) * ratio;
      const lng = start.longitude + (end.longitude - start.longitude) * ratio;

      // Add larger offsets to simulate road patterns
      const latOffset = (Math.random() - 0.5) * 0.0005; // Increased offset
      const lngOffset = (Math.random() - 0.5) * 0.0005;

      points.push({
        latitude: lat + latOffset,
        longitude: lng + lngOffset,
      });
    }
    return points;
  };

  const generateRoutes = useCallback(
    (checkpoints) => {
      if (!userLocation || !checkpoints?.length) return [];

      // Direct Route - visits checkpoints in order of proximity
      const directRoute = {
        id: "direct",
        name: "Quick Route",
        color: theme.magenta7.val,
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
      };

      // Scenic Route - takes a longer path with more curves
      const scenicRoute = {
        id: "scenic",
        name: "Scenic Route",
        color: theme.cyan8.val,
        checkpoints: checkpoints.reduce((acc, cp) => {
          // Add invisible points between checkpoints
          const lastPoint = acc[acc.length - 1] || userLocation;
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
          ).map((point) => ({
            ...point,
            // Add larger random offsets for more zigzag
            latitude: point.latitude + (Math.random() - 0.5) * 0.001,
            longitude: point.longitude + (Math.random() - 0.5) * 0.001,
          }));
          return [...acc, ...invisiblePoints, cp];
        }, []),
      };

      // Calculate total distances for each route
      [directRoute, scenicRoute, challengeRoute].forEach((route) => {
        let totalDist = 0;
        for (let i = 0; i < route.checkpoints.length - 1; i++) {
          totalDist += calculateDistance(
            route.checkpoints[i].latitude,
            route.checkpoints[i].longitude,
            route.checkpoints[i + 1].latitude,
            route.checkpoints[i + 1].longitude
          );
        }
        route.totalDistance = totalDist / 1000; // Convert to km
      });

      return [directRoute, scenicRoute, challengeRoute];
    },
    [userLocation, theme, calculateDistance]
  );

  useEffect(() => {
    if (userLocation && !selectedRoute) {
      const allCheckpoints = [
        ...(location?.checkpoints || []),
        ...testCheckpoints,
      ];
      const newRoutes = generateRoutes(allCheckpoints);
      setAvailableRoutes(newRoutes);
      if (newRoutes.length > 0) {
        setSelectedRoute(newRoutes[0]);
      }
    }
  }, [userLocation, location?.checkpoints, testCheckpoints, generateRoutes]);

  const RouteSelector = () => (
    <Card
      elevation={4}
      backgroundColor="$background"
      padding="$4"
      borderRadius={10}
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
            {route.name}
          </Button>
        ))}
      </YStack>
    </Card>
  );

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
    [location?.checkpoints, testCheckpoints, nearbyCheckpoint]
  );

  useEffect(() => {
    if (userLocation && testCheckpoints.length) {
      checkNearbyCheckpoints(userLocation);
    }
  }, [userLocation, testCheckpoints, checkNearbyCheckpoints]);

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
    const allCheckpoints = [...(location.checkpoints || [])];
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
  }, [location.checkpoints, theme]);

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
    navigation.navigate("Events", {
      screen: "EventDetail",
      params: {
        location,
        isActive: true,
        currentTime: elapsedTime,
        currentPoints: points,
        currentSteps: eventSteps,
      },
    });
  };

  const handleCapturePhoto = async () => {
    try {
      const checkpointPoints = selectedCheckpoint?.points || 0;

      // Immediately dismiss camera
      setShowCamera(false);
      setSelectedCheckpoint(null);

      // Get current user profile
      const userProfile = await getUserProfile();
      const currentPoints = parseInt(userProfile.points) || 0;
      const newTotalPoints = currentPoints + checkpointPoints;

      // First update local points
      await updatePoints(points + checkpointPoints);

      // Then update user profile
      await updateProfileMutation.mutateAsync({
        points: newTotalPoints,
      });
    } catch (error) {
      console.error("Error updating points:", error);
      Alert.alert("Error", "Failed to update points. Please try again.");
    }
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
            mapType="mutedStandard"
            userInterfaceStyle="light"
            showsUserLocation
            followsUserLocation={isFollowingUser}
            onPanDrag={() => setIsFollowingUser(false)}
          >
            <UrlTile
              urlTemplate="https://d.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
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

                {selectedRoute && (
                  <Polyline
                    coordinates={selectedRoute.checkpoints}
                    strokeColor={selectedRoute.color}
                    strokeWidth={3}
                    lineDashPattern={[1]}
                    lineCap="round"
                    lineJoin="round"
                  />
                )}
              </>
            )}

            {[...(location.checkpoints || [])].map((checkpoint) => (
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
            ))}

            {markers}

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
                    {eventSteps}
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
