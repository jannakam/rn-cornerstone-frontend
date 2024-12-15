import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Dimensions, View, Alert, Platform, TouchableOpacity, Linking } from 'react-native';
import { YStack, XStack, Text, Button, H5, useTheme } from 'tamagui';
import MapView, { Marker, Polyline, Circle, Callout } from 'react-native-maps';
import { Camera as CameraIcon, ChevronLeft, Award, Timer, MapPin, Footprints } from '@tamagui/lucide-icons';
import * as Location from 'expo-location';
import { useCameraPermissions, CameraView, CameraType } from 'expo-camera';
import AROverlay from '../components/AROverlay';


const CHECKPOINT_RADIUS = 20; // meters for auto camera button
const INTERACTION_RADIUS = 1000; // meters for manual camera interaction

const ActiveEvent = ({ route, navigation }) => {
  const { location } = route.params;
  const theme = useTheme();
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyCheckpoint, setNearbyCheckpoint] = useState(null);
  const [showAR, setShowAR] = useState(false);
  const [testCheckpoint, setTestCheckpoint] = useState(null);
  const [selectedCheckpoint, setSelectedCheckpoint] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState('back');

  // Request camera permissions on mount
  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    try {
      console.log('Checking camera permission...');
      if (!permission?.granted) {
        console.log('Requesting camera permission...');
        const { granted } = await requestPermission();
        console.log('Camera permission granted:', granted);
        
        if (!granted) {
          Alert.alert(
            'Camera Permission Required',
            'Please grant camera permission to use the AR features.',
            [
              {
                text: 'Open Settings',
                onPress: () => {
                  if (Platform.OS === 'ios') {
                    Linking.openURL('app-settings:');
                  } else {
                    Linking.openSettings();
                  }
                },
              },
              { text: 'Cancel', style: 'cancel' },
            ]
          );
        }
      } else {
        console.log('Camera permission already granted');
      }
    } catch (err) {
      console.error('Error requesting camera permission:', err);
      setCameraError(err.message);
      Alert.alert('Error', 'Failed to request camera permission: ' + err.message);
    }
  };

  // Request location permissions and setup location tracking
  useEffect(() => {
    setupLocationTracking();
    return () => {
      // Cleanup location tracking on unmount
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
    };
  }, []);

  const locationSubscription = useRef(null);

  const setupLocationTracking = async () => {
    try {
      console.log('Setting up location tracking...');
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
          
          if (!testCheckpoint && location.coords) {
            const newTestCheckpoint = {
              id: 'test',
              name: 'Test Checkpoint',
              latitude: location.coords.latitude + 0.0001,
              longitude: location.coords.longitude + 0.0001,
              points: 100,
              steps: 500,
              approx_distance: 0.2,
            };
            setTestCheckpoint(newTestCheckpoint);
          }
          
          checkNearbyCheckpoints(location.coords);
        }
      );
    } catch (err) {
      console.error('Error setting up location tracking:', err);
      Alert.alert('Error', 'Failed to setup location tracking: ' + err.message);
    }
  };

  const checkNearbyCheckpoints = (userCoords) => {
    const checkpointInRange = location.checkpoints.find(checkpoint => {
      const distance = calculateDistance(
        userCoords.latitude,
        userCoords.longitude,
        checkpoint.latitude,
        checkpoint.longitude
      );
      return distance <= CHECKPOINT_RADIUS;
    });

    if (!checkpointInRange && testCheckpoint) {
      const testDistance = calculateDistance(
        userCoords.latitude,
        userCoords.longitude,
        testCheckpoint.latitude,
        testCheckpoint.longitude
      );
      if (testDistance <= CHECKPOINT_RADIUS) {
        setNearbyCheckpoint(testCheckpoint);
        return;
      }
    }

    setNearbyCheckpoint(checkpointInRange);
  };

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

  const handleOpenCamera = async (checkpoint) => {
    console.log('handleOpenCamera called with:', checkpoint);
    
    try {
      if (!permission?.granted) {
        await requestCameraPermission();
        if (!permission?.granted) {
          return;
        }
      }

      console.log('Setting state...');
      setSelectedCheckpoint(checkpoint);
      setShowAR(true);
      console.log('Camera should open now');
    } catch (err) {
      console.error('Error opening camera:', err);
      Alert.alert('Error', 'Failed to open camera: ' + err.message);
    }
  };

  // Add logging for state changes
  useEffect(() => {
    console.log('State changed:', { showAR, selectedCheckpoint, nearbyCheckpoint });
  }, [showAR, selectedCheckpoint, nearbyCheckpoint]);

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

  // Add a direct test function
  const testCamera = async () => {
    console.log('Testing camera...');
    if (!permission?.granted) {
      console.log('No permission, requesting...');
      const { granted } = await requestPermission();
      if (!granted) {
        console.log('Permission denied');
        return;
      }
    }
    console.log('Setting showAR to true');
    setShowAR(true);
  };

  const CustomCallout = ({ checkpoint }) => (
    <View style={styles.calloutContainer}>
      <Text style={[styles.calloutTitle, { color: theme.color.val }]}>
        {checkpoint.name}
      </Text>
      <XStack space="$2" ai="center">
        <Award size={16} color={theme.cyan7.val} />
        <Text style={[styles.calloutText, { color: theme.color.val }]}>
          {checkpoint.points} points
        </Text>
      </XStack>
      <XStack space="$2" ai="center">
        <Footprints size={16} color={theme.magenta7.val} />
        <Text style={[styles.calloutText, { color: theme.color.val }]}>
          {checkpoint.steps} steps
        </Text>
      </XStack>
      <Button
        size="$2"
        theme="active"
        onPress={() => {
          console.log('Callout button pressed');
          handleCheckpointPress(checkpoint);
        }}
        mt="$2"
        iconAfter={CameraIcon}
      >
        Open Camera
      </Button>
    </View>
  );

  return (
    <YStack f={1} bg="$background">
      <XStack ai="center" space="$3" jc="space-between" px="$4">
        <Button
          icon={ChevronLeft}
          onPress={() => navigation.goBack()}
          backgroundColor="transparent"
          size="$8"
        />
        <H5 color="$color">{location.name}</H5>
        <Button
          size="$4"
          theme="active"
          onPress={testCamera}
        >
          Test Camera
        </Button>
      </XStack>

      {showAR ? (
        <View style={styles.container}>
          {permission?.granted ? (
            <CameraView style={styles.camera} facing={facing}>
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={styles.button} 
                  onPress={() => setFacing(current => current === 'back' ? 'front' : 'back')}
                >
                  <Text style={styles.text}>Flip Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.button} 
                  onPress={() => {
                    setShowAR(false);
                    setSelectedCheckpoint(null);
                  }}
                >
                  <Text style={styles.text}>Close Camera</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.overlayContainer}>
                <AROverlay checkpoint={selectedCheckpoint || nearbyCheckpoint} />
              </View>
            </CameraView>
          ) : (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Camera permission not granted</Text>
              <Button
                size="$4"
                theme="active"
                onPress={requestCameraPermission}
              >
                Grant Permission
              </Button>
            </View>
          )}
        </View>
      ) : (
        <>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            showsUserLocation
            followsUserLocation
          >
            {/* Draw circles first (bottom layer) */}
            {location.checkpoints.map((checkpoint) => (
              <Circle
                key={`circle-${checkpoint.id}`}
                center={{
                  latitude: checkpoint.latitude,
                  longitude: checkpoint.longitude,
                }}
                radius={CHECKPOINT_RADIUS}
                fillColor={theme.magenta7.val + '20'}
                strokeColor={theme.magenta7.val}
                strokeWidth={1}
                zIndex={1}
              />
            ))}

            {testCheckpoint && (
              <Circle
                center={{
                  latitude: testCheckpoint.latitude,
                  longitude: testCheckpoint.longitude,
                }}
                radius={CHECKPOINT_RADIUS}
                fillColor={theme.cyan8.val + '20'}
                strokeColor={theme.cyan8.val}
                strokeWidth={1}
                zIndex={1}
              />
            )}

            {userLocation && (
              <Circle
                center={{
                  latitude: userLocation.latitude,
                  longitude: userLocation.longitude,
                }}
                radius={INTERACTION_RADIUS}
                fillColor={theme.cyan8.val + '10'}
                strokeColor={theme.cyan8.val}
                strokeWidth={1}
                zIndex={1}
              />
            )}

            {/* Draw polyline next */}
            <Polyline
              coordinates={[
                { latitude: location.latitude, longitude: location.longitude },
                ...location.checkpoints.map(checkpoint => ({
                  latitude: checkpoint.latitude,
                  longitude: checkpoint.longitude,
                })),
                { latitude: location.latitude, longitude: location.longitude },
              ]}
              strokeColor={theme.magenta7.val}
              strokeWidth={3}
              lineDashPattern={[1]}
              zIndex={2}
            />

            {/* Draw markers last (top layer) */}
            {location.checkpoints.map((checkpoint) => (
              <Marker
                key={`marker-${checkpoint.id}`}
                coordinate={{
                  latitude: checkpoint.latitude,
                  longitude: checkpoint.longitude,
                }}
                zIndex={3}
              >
                <Callout style={styles.calloutWrapper}>
                  <CustomCallout checkpoint={checkpoint} />
                </Callout>
              </Marker>
            ))}

            {testCheckpoint && (
              <Marker
                coordinate={{
                  latitude: testCheckpoint.latitude,
                  longitude: testCheckpoint.longitude,
                }}
                zIndex={3}
              >
                <Callout style={styles.calloutWrapper}>
                  <CustomCallout checkpoint={testCheckpoint} />
                </Callout>
              </Marker>
            )}
          </MapView>

          {nearbyCheckpoint && (
            <Button
              size="$4"
              theme="active"
              onPress={() => {
                console.log('Bottom button pressed');
                handleOpenCamera(nearbyCheckpoint);
              }}
              position="absolute"
              bottom={20}
              alignSelf="center"
              iconAfter={CameraIcon}
            >
              Open Camera
            </Button>
          )}
        </>
      )}
    </YStack>
  );
};

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 60,
  },
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
  overlayContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  calloutContainer: {
    padding: 10,
    minWidth: 200,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  calloutText: {
    fontSize: 14,
    marginBottom: 4,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  calloutWrapper: {
    zIndex: 4,
  },
});

export default ActiveEvent; 