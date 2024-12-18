import { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Pedometer } from "expo-sensors";
import { updateStepsForDailyChallenge } from "../api/Auth";

export default function App({ dailyChallengeId }) {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState("checking");
  const [pastStepCount, setPastStepCount] = useState(0);
  const [currentStepCount, setCurrentStepCount] = useState(0);

  const UPDATE_INTERVAL = 2000; // Update every 2 seconds

  const updateDailyChallenge = async (steps) => {
    try {
      if (dailyChallengeId) {
        console.log('Sending current steps to server:', {
          dailyChallengeId,
          steps: steps
        });
        
        await updateStepsForDailyChallenge(dailyChallengeId, {
          steps: steps
        });
      }
    } catch (error) {
      console.error("Failed to update steps:", error);
    }
  };

  const subscribe = async () => {
    const isAvailable = await Pedometer.isAvailableAsync();
    setIsPedometerAvailable(String(isAvailable));

    if (isAvailable) {
      // Watch current steps and update server
      const subscription = Pedometer.watchStepCount((result) => {
        setCurrentStepCount(result.steps);
        console.log('Current Steps Updated:', result.steps);
        updateDailyChallenge(result.steps);
      });

      // Set up interval for updating server
      const updateInterval = setInterval(() => {
        if (currentStepCount > 0) {
          updateDailyChallenge(currentStepCount);
        }
      }, UPDATE_INTERVAL);

      return () => {
        clearInterval(updateInterval);
        subscription.remove();
      };
    }
  };

  useEffect(() => {
    const subscription = subscribe();
    return () => {
      if (subscription) {
        subscription.then(cleanup => cleanup && cleanup());
      }
    };
  }, [dailyChallengeId]);

  return (
    <View style={styles.container}>
      <Text>Pedometer.isAvailableAsync(): {isPedometerAvailable}</Text>
      <Text>Current session steps: {currentStepCount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
    alignItems: "center",
    justifyContent: "center",
  },
});
