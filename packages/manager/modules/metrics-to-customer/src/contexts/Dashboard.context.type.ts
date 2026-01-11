import { DashboardState } from '@/contexts';

export interface DashboardContextType {
  state: DashboardState;
  setState: React.Dispatch<React.SetStateAction<DashboardState>>;
}
