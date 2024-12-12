import React, { useState, forwardRef, useImperativeHandle } from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import MapView from "react-native-maps";

const Map = forwardRef((props, ref) => {
  const [error, setError] = useState(null);

  useImperativeHandle(ref, () => ({
    // Add any methods you want to expose to the parent component here
  }));

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error loading map: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 29.3759,
          longitude: 47.9774,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        userInterfaceStyle={"dark"}
        mapType="standard"
        onError={(error) => setError(error.nativeEvent.error)}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});

export default Map;
