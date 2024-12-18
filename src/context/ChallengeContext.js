import React, { createContext, useState, useContext } from 'react';

const ChallengeContext = createContext();

export const ChallengeProvider = ({ children }) => {
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [challengeSteps, setChallengeSteps] = useState(0);
  const [baseSteps, setBaseSteps] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  const startChallenge = (challengeData) => {
    setActiveChallenge({
      id: challengeData.id,
      participants: challengeData.participants || [],
      targetSteps: challengeData.targetSteps,
      startTime: new Date().toISOString(),
    });
    setChallengeSteps(0);
    setBaseSteps(0);
    setElapsedTime(0);
  };

  const updateSteps = (newSteps) => {
    setChallengeSteps(newSteps);
  };

  const setInitialSteps = (steps) => {
    setBaseSteps(steps);
  };

  const updateTime = (seconds) => {
    setElapsedTime(seconds);
  };

  const updateProgress = (userId, steps) => {
    setActiveChallenge(prev => {
      if (!prev) return null;
      return {
        ...prev,
        participants: prev.participants.map(p => 
          p.id === userId ? { ...p, steps } : p
        )
      };
    });
  };

  const endChallenge = () => {
    setActiveChallenge(null);
    setChallengeSteps(0);
    setBaseSteps(0);
    setElapsedTime(0);
  };

  return (
    <ChallengeContext.Provider 
      value={{ 
        activeChallenge,
        challengeSteps,
        baseSteps,
        elapsedTime,
        startChallenge,
        updateSteps,
        setInitialSteps,
        updateTime,
        updateProgress,
        endChallenge 
      }}
    >
      {children}
    </ChallengeContext.Provider>
  );
};

export const useChallenge = () => {
  const context = useContext(ChallengeContext);
  if (!context) {
    throw new Error('useChallenge must be used within a ChallengeProvider');
  }
  return context;
}; 