import React, { ReactNode, createContext, useContext, useMemo, useState } from 'react';

import { defaultTimeRangeOptions } from '@/constants/timeControls/TimeRangeOption.constants';
import { DashboardContextType } from '@/contexts/Dashboard.context.type';
import { TimeRangeOption } from '@/types/TimeRangeOption.type';
import { calculateDateTimeRange } from '@/utils/dateTimeUtils';

export interface DashboardState {
  isLoading: string | undefined;
  startDateTime: number;
  endDateTime: number;
  selectedTimeOption: TimeRangeOption;
  refreshInterval: number;
}

interface DashboardProviderProps {
  children: ReactNode;
  context?: Partial<DashboardState>;
}

export const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const useDashboardContext = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

export const DashboardProvider = ({ children, context = {} }: DashboardProviderProps) => {
  const {
    isLoading = undefined,
    refreshInterval = 15,
    selectedTimeOption,
    startDateTime,
    endDateTime,
  } = context;

  const initialSelectedTimeOption =
    selectedTimeOption ?? (defaultTimeRangeOptions[0] as TimeRangeOption);
  const { startDateTime: initialStartDateTime, endDateTime: initialEndDateTime } =
    calculateDateTimeRange(initialSelectedTimeOption, endDateTime, startDateTime);

  const [state, setState] = useState<DashboardState>({
    isLoading,
    refreshInterval,
    selectedTimeOption: initialSelectedTimeOption,
    startDateTime: initialStartDateTime,
    endDateTime: initialEndDateTime,
  });

  const { startDateTime: derivedStartDateTime, endDateTime: derivedEndDateTime } = useMemo(() => {
    if (state.selectedTimeOption.value === 'custom') {
      return {
        startDateTime: state.startDateTime,
        endDateTime: state.endDateTime,
      };
    }

    return calculateDateTimeRange(state.selectedTimeOption);
  }, [state.selectedTimeOption, state.startDateTime, state.endDateTime]);

  return (
    <DashboardContext.Provider
      value={{
        state: {
          ...state,
          startDateTime: derivedStartDateTime,
          endDateTime: derivedEndDateTime,
        },
        setState,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
