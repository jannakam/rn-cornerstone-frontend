import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { StyleSheet, Dimensions, View, Alert, Platform } from 'react-native';
import { YStack, XStack, Text, Button, Card, useTheme } from 'tamagui';
import MapView, { Marker, Polyline, Circle, Callout, UrlTile } from 'react-native-maps';
import { Camera as CameraIcon, ChevronLeft, Award, Timer, MapPin, Footprints, X, Crosshair } from '@tamagui/lucide-icons';
import * as Location from 'expo-location';
import { useCameraPermissions, CameraView } from 'expo-camera';

const CHECKPOINT_RADIUS = 200; // increased from 20 meters to 100 meters for easier activation
const INTERACTION_RADIUS = 1000; // keeping this the same for visual purposes

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
          <Text color="$color">
            {checkpoint.points} points
          </Text>
        </XStack>
        <XStack space="$2" ai="center">
          <Footprints size={16} color={theme.magenta7.val} />
          <Text color="$color">
            {checkpoint.steps} steps
          </Text>
        </XStack>
      </XStack>
    </YStack>
  </Card>
));

const ActiveEvent = ({ route, navigation }) => {
  const { location, isActive: wasActive, currentTime, currentPoints } = route.params;
  const theme = useTheme();
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyCheckpoint, setNearbyCheckpoint] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [selectedCheckpoint, setSelectedCheckpoint] = useState(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [elapsedTime, setElapsedTime] = useState(currentTime || 0);
  const [points, setPoints] = useState(currentPoints || 0);
  const [isActive, setIsActive] = useState(true);
  const timerRef = useRef(null);
  const locationSubscription = useRef(null);
  const [isFollowingUser, setIsFollowingUser] = useState(false);
  const mapRef = useRef(null);
  const [fixedCheckpoints, setFixedCheckpoints] = useState([]);
  const hasCreatedCheckpoints = useRef(false);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isActive]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndEvent = () => {
    Alert.alert(
      "End Event",
      "Are you sure you want to end this event?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "End",
          onPress: () => {
            setIsActive(false);
            clearInterval(timerRef.current);
            navigation.navigate("Events", {
              screen: "EventDetail",
              params: { 
                location,
                isActive: false,
                currentTime: 0,
                currentPoints: 0
              }
            });
          },
          style: "destructive"
        }
      ]
    );
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
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required for this feature.');
        return;
      }

      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 1,
        },
        (location) => {
          setUserLocation(location.coords);
          checkNearbyCheckpoints(location.coords);
        }
      );
    } catch (err) {
      Alert.alert('Error', 'Failed to setup location tracking: ' + err.message);
    }
  };

  useEffect(() => {
    if (userLocation && !hasCreatedCheckpoints.current) {
      const newCheckpoints = [
        {
          id: 'fixed1',
          name: 'Checkpoint Alpha',
          latitude: userLocation.latitude + 0.0002,
          longitude: userLocation.longitude + 0.0002,
          points: 100,
          steps: 500,
        },
        {
          id: 'fixed2',
          name: 'Checkpoint Beta',
          latitude: userLocation.latitude - 0.0002,
          longitude: userLocation.longitude + 0.0002,
          points: 200,
          steps: 1000,
        },
        {
          id: 'fixed3',
          name: 'Checkpoint Gamma',
          latitude: userLocation.latitude,
          longitude: userLocation.longitude + 0.0003,
          points: 300,
          steps: 1500,
        },
      ];
      setFixedCheckpoints(newCheckpoints);
      hasCreatedCheckpoints.current = true;
      checkNearbyCheckpoints(userLocation);
    }
  }, [userLocation]);

  const checkNearbyCheckpoints = useCallback((userCoords) => {
    const allCheckpoints = [...location.checkpoints, ...fixedCheckpoints];
    const checkpointInRange = allCheckpoints.find(checkpoint => {
      const distance = calculateDistance(
        userCoords.latitude,
        userCoords.longitude,
        checkpoint.latitude,
        checkpoint.longitude
      );
      return distance <= CHECKPOINT_RADIUS;
    });
    setNearbyCheckpoint(checkpointInRange);
  }, [location.checkpoints, fixedCheckpoints]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  const generateIntermediatePoints = (start, end, numPoints = 3) => {
    const points = [];
    // Generate points that deviate slightly from the direct line
    for (let i = 1; i <= numPoints; i++) {
      const ratio = i / (numPoints + 1);
      const lat = start.latitude + (end.latitude - start.latitude) * ratio;
      const lng = start.longitude + (end.longitude - start.longitude) * ratio;
      
      // Add some randomness to make it look like street paths
      const latOffset = (Math.random() - 0.5) * 0.0002; // About 20m deviation
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
    return [
      start,
      ...intermediatePoints,
      end
    ];
  };

  const generateRouteSegments = (userLocation, checkpoints) => {
    if (!userLocation || !checkpoints.length) return [];

    const segments = [];
    let currentPoint = {
      latitude: userLocation.latitude,
      longitude: userLocation.longitude
    };

    checkpoints.forEach((checkpoint) => {
      const routePoints = generateRouteToCheckpoint(currentPoint, {
        latitude: checkpoint.latitude,
        longitude: checkpoint.longitude
      });
      segments.push(routePoints);
      currentPoint = {
        latitude: checkpoint.latitude,
        longitude: checkpoint.longitude
      };
    });

    return segments;
  };

  const handleOpenCamera = async (checkpoint) => {
    try {
      if (!permission?.granted) {
        const { granted } = await requestPermission();
        if (!granted) return;
      }
      setSelectedCheckpoint(checkpoint);
      setShowCamera(true);
    } catch (err) {
      Alert.alert('Error', 'Failed to open camera: ' + err.message);
    }
  };

  const handleCheckpointPress = (checkpoint) => {
    if (!userLocation) {
      Alert.alert('Error', 'Waiting for location...');
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
    const allCheckpoints = [...location.checkpoints, ...fixedCheckpoints];
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
      mapRef.current.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
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
        currentPoints: points
      }
    });
  };

  return (
    <YStack f={1} bg="$background">
      {showCamera ? (
        <View style={styles.container}>
          <CameraView style={styles.camera}>
          <Text marginTop={400} marginLeft={20} marginRight={20} textAlign="center" fontSize="$8" fontWeight="bold" color="$color">You made it to {selectedCheckpoint?.name}!</Text>
          <Text marginLeft={20} marginRight={20} textAlign="center" fontSize="$4" fontWeight="bold" color="$color">Take a photo to earn {selectedCheckpoint?.points} points.</Text>
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
              onPress={() => {
                setPoints(prev => prev + (selectedCheckpoint?.points || 0));
                setShowCamera(false);
                setSelectedCheckpoint(null);
              }}
              backgroundColor={theme.background.val}
              borderColor={theme.cyan8.val}
              borderWidth={1}
              color={theme.cyan8.val}
              borderRadius="$9"
              scale={1.2}
              w="70%"
              position="absolute"
              bottom={40}
              alignSelf="center"
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
          urlTemplate={"https://d.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"}
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
                
                {generateRouteSegments(userLocation, [...location.checkpoints, ...fixedCheckpoints])
                  .map((segment, index) => (
                    <Polyline
                      key={`route-${index}`}
                      coordinates={segment}
                      strokeColor={index < points ? theme.lime7.val : theme.magenta7.val}
                      strokeWidth={3}
                      lineDashPattern={[1]}
                      zIndex={2}
                    />
                  ))
                }
              </>
            )}

            {[...location.checkpoints, ...fixedCheckpoints].map((checkpoint) => (
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
          </MapView>

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
            <YStack space="$4" ai="center" jc="space-between" w="100%">
              <Button
                  size="$3"
                  icon={nearbyCheckpoint ? CameraIcon : null}
                  onPress={() => handleOpenCamera(nearbyCheckpoint)}
                  backgroundColor={theme.background.val}
                  borderColor={theme.cyan8.val}
                  borderWidth={1}
                  zIndex={10001}
                  color={theme.cyan8.val}
                  borderRadius="$9"
                  scale={1.2}
                  w="90%"
                  disabled={!nearbyCheckpoint}
                  elevate
                  elevation={4}
                >
                  Capture Checkpoint
              </Button>
              <XStack ai="center" jc="space-between" w="100%" zIndex={999}>
                <Button
                  size="$5"
                  icon={ChevronLeft}
                  onPress={handleBack}
                  backgroundColor="transparent"
                  color="$color"
                  p="$0"
                  paddingHorizontal="$2"
                />
                <XStack space="$5" ai="center" scale={1.1}>
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
                  <Button
                  size="$3"
                  onPress={handleEndEvent}
                  backgroundColor={theme.background.val}
                  color="white"
                  borderColor="$color"
                  borderWidth={1}
                  borderRadius="$8"
                  p="$1"
                  w="$5"
                >
                  End
                </Button>
                </XStack>
                
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
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
});

export default ActiveEvent; 