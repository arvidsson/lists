import React, { ReactNode, createContext, useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

type NetworkProps = {
  children?: ReactNode;
};

export const NetworkContext = createContext({ isConnected: false });

export const NetworkProvider = ({ children }: NetworkProps) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected || false);
    });

    return unsubscribe;
  }, []);

  const value = {
    isConnected,
  };

  return <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>;
};
