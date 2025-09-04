import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface DashboardState {
  selectedTimeOption: string;
  refreshInterval: number;
}

interface DashboardContextType {
  state: DashboardState;
  setState: React.Dispatch<React.SetStateAction<DashboardState>>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined,
);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

type DashboardProviderConfig = Partial<DashboardState>;

interface DashboardProviderProps {
  children: ReactNode;
  context?: DashboardProviderConfig;
}

export const DashboardProvider = ({
  children,
  context = {},
}: DashboardProviderProps) => {
  const { selectedTimeOption = '1h', refreshInterval = 15 } = context;

  const [state, setState] = useState<DashboardState>({
    selectedTimeOption,
    refreshInterval,
  });

  return (
    <DashboardContext.Provider value={{ state, setState }}>
      {children}
    </DashboardContext.Provider>
  );
};
