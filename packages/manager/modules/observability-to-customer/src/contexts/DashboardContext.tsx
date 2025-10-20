import React, { ReactNode, createContext, useContext, useState } from 'react';

import { defaultTimeRangeOptions } from '../components/timeControls/TimeRangeOption.constants';
import { TimeRangeOption } from '../types/TimeRangeOption.type';

export interface DashboardState {
  isLoading: string | undefined;
  startDateTime: number | undefined;
  endDateTime: number | undefined;
  selectedTimeOption: TimeRangeOption;
  refreshInterval: number;
}

interface DashboardContextType {
  state: DashboardState;
  setState: React.Dispatch<React.SetStateAction<DashboardState>>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const useDashboardContext = () => {
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

export const DashboardProvider = ({ children, context = {} }: DashboardProviderProps) => {
  const {
    isLoading = undefined,
    selectedTimeOption = defaultTimeRangeOptions[0] as TimeRangeOption,
    refreshInterval = 15,
    startDateTime,
    endDateTime,
  } = context;

  const [state, setState] = useState<DashboardState>({
    isLoading,
    startDateTime,
    endDateTime,
    selectedTimeOption,
    refreshInterval,
  });

  return (
    <DashboardContext.Provider value={{ state, setState }}>{children}</DashboardContext.Provider>
  );
};
