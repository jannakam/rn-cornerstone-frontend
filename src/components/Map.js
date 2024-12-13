import React, { useState, forwardRef, useImperativeHandle } from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import MapView, { UrlTile } from "react-native-maps";

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
    <View>
      <MapView
        mapType="mutedStandard" 
        userInterfaceStyle="dark"
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
          /**
           * The url template of the tile server. The patterns {x} {y} {z} will be replaced at runtime
           * For example, http://c.tile.openstreetmap.org/{z}/{x}/{y}.png
           */
          urlTemplate={'https://d.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'}
          shouldReplaceMapContent={true}
          /**
           * The maximum zoom level for this tile overlay. Corresponds to the maximumZ setting in
           * MKTileOverlay. iOS only.
           */
          maximumZ={19}
          /**
           * flipY allows tiles with inverted y coordinates (origin at bottom left of map)
           * to be used. Its default value is false.
           */
          flipY={false}
        />
      </MapView>
    </View>
  );
});

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});

export default Map;
