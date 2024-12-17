import React, { createContext, useState, useContext } from 'react';

const ActiveEventContext = createContext();

export const ActiveEventProvider = ({ children }) => {
  const [activeEvent, setActiveEvent] = useState(null);
  const [eventSteps, setEventSteps] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [points, setPoints] = useState(0);

  const startEvent = (eventData) => {
    setActiveEvent({
      id: eventData.id,
      name: eventData.name,
      checkpoints: eventData.checkpoints || [],
      startTime: new Date().toISOString(),
    });
    setEventSteps(0);
    setElapsedTime(0);
    setPoints(0);
  };

  const updateEventSteps = (newSteps) => {
    setEventSteps(newSteps);
  };

  const updatePoints = (newPoints) => {
    setPoints(newPoints);
  };

  const updateTime = (seconds) => {
    setElapsedTime(seconds);
  };

  const endEvent = () => {
    setActiveEvent(null);
    setEventSteps(0);
    setElapsedTime(0);
    setPoints(0);
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
    throw new Error('useActiveEvent must be used within an ActiveEventProvider');
  }
  return context;
};
