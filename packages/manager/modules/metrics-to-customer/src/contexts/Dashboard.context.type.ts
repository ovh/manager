import React from 'react';

import { DashboardState } from '@/contexts/Dashboard.context';

export interface DashboardContextType {
  state: DashboardState & { regionAvailable: boolean };
  setState: React.Dispatch<React.SetStateAction<DashboardState>>;
}
