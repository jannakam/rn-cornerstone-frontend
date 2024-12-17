import React, { createContext, useState, useContext } from 'react';

const ChallengeContext = createContext();

export const ChallengeProvider = ({ children }) => {
  const [activeChallenge, setActiveChallenge] = useState(null);

  const startChallenge = (friend, targetSteps) => {
    setActiveChallenge({
      friend,
      targetSteps,
      startTime: new Date().toISOString(),
      progress: {
        user: 0,
        friend: 0
      }
    });
  };

  const updateProgress = (userId, steps) => {
    setActiveChallenge(prev => ({
      ...prev,
      progress: {
        ...prev.progress,
        [userId]: steps
      }
    }));
  };

  const endChallenge = () => {
    setActiveChallenge(null);
  };

  return (
    <ChallengeContext.Provider 
      value={{ 
        activeChallenge, 
        startChallenge, 
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