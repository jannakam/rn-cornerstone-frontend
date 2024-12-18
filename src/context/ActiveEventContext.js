import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ActiveEventContext = createContext();

const STORAGE_KEYS = {
  ACTIVE_EVENT: "@active_event",
  EVENT_STEPS: "@event_steps",
  ELAPSED_TIME: "@elapsed_time",
  POINTS: "@event_points",
};

export const ActiveEventProvider = ({ children }) => {
  const [activeEvent, setActiveEvent] = useState(null);
  const [eventSteps, setEventSteps] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [points, setPoints] = useState(0);

  // Clear persisted state on mount
  useEffect(() => {
    const clearPersistedState = async () => {
      try {
        await Promise.all([
          AsyncStorage.removeItem(STORAGE_KEYS.ACTIVE_EVENT),
          AsyncStorage.removeItem(STORAGE_KEYS.EVENT_STEPS),
          AsyncStorage.removeItem(STORAGE_KEYS.ELAPSED_TIME),
          AsyncStorage.removeItem(STORAGE_KEYS.POINTS),
        ]);

        // Reset state
        setActiveEvent(null);
        setEventSteps(0);
        setElapsedTime(0);
        setPoints(0);
      } catch (error) {
        console.error("Error clearing persisted event state:", error);
      }
    };

    // Clear state when component mounts
    clearPersistedState();
  }, []); // Empty dependency array means this runs once on mount

  // Load persisted state on mount
  useEffect(() => {
    const loadPersistedState = async () => {
      try {
        const [persistedEvent, persistedSteps, persistedTime, persistedPoints] =
          await Promise.all([
            AsyncStorage.getItem(STORAGE_KEYS.ACTIVE_EVENT),
            AsyncStorage.getItem(STORAGE_KEYS.EVENT_STEPS),
            AsyncStorage.getItem(STORAGE_KEYS.ELAPSED_TIME),
            AsyncStorage.getItem(STORAGE_KEYS.POINTS),
          ]);

        if (persistedEvent) setActiveEvent(JSON.parse(persistedEvent));
        if (persistedSteps) setEventSteps(parseInt(persistedSteps));
        if (persistedTime) setElapsedTime(parseInt(persistedTime));
        if (persistedPoints) setPoints(parseInt(persistedPoints));
      } catch (error) {
        console.error("Error loading persisted event state:", error);
      }
    };

    loadPersistedState();
  }, []);

  const startEvent = async (eventData) => {
    const newEvent = {
      id: eventData.id,
      name: eventData.name,
      checkpoints: eventData.checkpoints || [],
      startTime: new Date().toISOString(),
    };

    try {
      await Promise.all([
        AsyncStorage.setItem(
          STORAGE_KEYS.ACTIVE_EVENT,
          JSON.stringify(newEvent)
        ),
        AsyncStorage.setItem(STORAGE_KEYS.EVENT_STEPS, "0"),
        AsyncStorage.setItem(STORAGE_KEYS.ELAPSED_TIME, "0"),
        AsyncStorage.setItem(STORAGE_KEYS.POINTS, "0"),
      ]);

      setActiveEvent(newEvent);
      setEventSteps(0);
      setElapsedTime(0);
      setPoints(0);
    } catch (error) {
      console.error("Error persisting event start:", error);
    }
  };

  const updateEventSteps = async (newSteps) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.EVENT_STEPS, newSteps.toString());
      setEventSteps(newSteps);
    } catch (error) {
      console.error("Error persisting event steps:", error);
    }
  };

  const updatePoints = async (newPoints) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.POINTS, newPoints.toString());
      setPoints(newPoints);
    } catch (error) {
      console.error("Error persisting points:", error);
    }
  };

  const updateTime = async (seconds) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ELAPSED_TIME, seconds.toString());
      setElapsedTime(seconds);
    } catch (error) {
      console.error("Error persisting elapsed time:", error);
    }
  };

  const endEvent = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.ACTIVE_EVENT),
        AsyncStorage.removeItem(STORAGE_KEYS.EVENT_STEPS),
        AsyncStorage.removeItem(STORAGE_KEYS.ELAPSED_TIME),
        AsyncStorage.removeItem(STORAGE_KEYS.POINTS),
      ]);

      setActiveEvent(null);
      setEventSteps(0);
      setElapsedTime(0);
      setPoints(0);
    } catch (error) {
      console.error("Error clearing event state:", error);
    }
  };

  return (
    <ActiveEventContext.Provider
      value={{
        activeEvent,
        eventSteps,
        elapsedTime,
        points,
        startEvent,
        updateEventSteps,
        updatePoints,
        updateTime,
        endEvent,
      }}
    >
      {children}
    </ActiveEventContext.Provider>
  );
};

export const useActiveEvent = () => {
  const context = useContext(ActiveEventContext);
  if (!context) {
    throw new Error(
      "useActiveEvent must be used within an ActiveEventProvider"
    );
  }
  return context;
};
