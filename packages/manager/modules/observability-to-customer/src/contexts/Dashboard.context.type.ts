import { DashboardState } from '@/contexts/Dashboard.context';

export interface DashboardContextType {
  state: DashboardState;
  setState: React.Dispatch<React.SetStateAction<DashboardState>>;
}
