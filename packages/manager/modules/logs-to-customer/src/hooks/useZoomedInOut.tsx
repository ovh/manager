import React, { ReactNode, createContext, useContext, useMemo, useState } from 'react';

interface ZoomedInOutContextType {
  isZoomedIn: boolean;
  setIsZoomedIn: React.Dispatch<React.SetStateAction<boolean>>;
  toggleZoom: () => void;
}

const ZoomedInOutContext = createContext<ZoomedInOutContextType | null>(null);

export const useZoomedInOut = () => {
  const context = useContext(ZoomedInOutContext);
  if (!context) {
    throw new Error('useZoomedInOut must be used within an ZoomedInOutProvider');
  }
  return context;
};

export const ZoomedInOutProvider = ({ children }: { children: ReactNode }) => {
  const [isZoomedIn, setIsZoomedIn] = useState(false);

  const value = useMemo(
    () => ({
      isZoomedIn,
      setIsZoomedIn,
      toggleZoom: () => setIsZoomedIn((prev) => !prev),
    }),
    [isZoomedIn],
  );

  return <ZoomedInOutContext.Provider value={value}>{children}</ZoomedInOutContext.Provider>;
};
