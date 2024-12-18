import React, { createContext, useContext, useState, useEffect } from 'react';
import { Pedometer } from 'expo-sensors';
import { useQueryClient } from '@tanstack/react-query';

const PedometerContext = createContext();

export const PedometerProvider = ({ children }) => {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [pastStepCount, setPastStepCount] = useState(0);
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const queryClient = useQueryClient();

  useEffect(() => {
    let isMounted = true;
    let subscription = null;
    let updateInterval = null;

    const subscribe = async () => {
      try {
        const isAvailable = await Pedometer.isAvailableAsync();
        if (!isMounted) return;
        setIsPedometerAvailable(String(isAvailable));

        if (isAvailable) {
          const end = new Date();
          const start = new Date();
          start.setDate(end.getDate() - 1);

          const pastStepCountResult = await Pedometer.getStepCountAsync(start, end);
          if (pastStepCountResult && isMounted) {
            setPastStepCount(pastStepCountResult.steps);
          }

          // Set up interval to update steps every 2 seconds
          updateInterval = setInterval(async () => {
            if (isMounted) {
              const newEnd = new Date();
              const newStart = new Date();
              newStart.setDate(newEnd.getDate() - 1);

              const newPastStepCount = await Pedometer.getStepCountAsync(newStart, newEnd);
              if (newPastStepCount) {
                setPastStepCount(newPastStepCount.steps);
                queryClient.invalidateQueries(['userProfile']);
              }
            }
          }, 2000);

          // Store the subscription for current steps
          subscription = Pedometer.watchStepCount(result => {
            if (isMounted) {
              setCurrentStepCount(result.steps);
              queryClient.invalidateQueries(['userProfile']);
            }
          });
        }
      } catch (error) {
        console.error("Error setting up pedometer:", error);
        if (isMounted) setIsPedometerAvailable("false");
      }
    };

    subscribe();

    return () => {
      isMounted = false;
      if (subscription) subscription.remove();
      if (updateInterval) clearInterval(updateInterval);
    };
  }, [queryClient]);

  return (
    <PedometerContext.Provider
      value={{
        isPedometerAvailable,
        pastStepCount,
        currentStepCount,
      }}
    >
      {children}
    </PedometerContext.Provider>
  );
};

export const usePedometer = () => {
  const context = useContext(PedometerContext);
  if (context === undefined) {
    throw new Error('usePedometer must be used within a PedometerProvider');
  }
  return context;
};
