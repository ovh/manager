import { DashboardState } from '@/contexts';

import { TimeRangeOptionWithLabel } from './TimeRangeOptionWithLabel.type';

export interface TimeControlsProps {
  timeOptions?: TimeRangeOptionWithLabel[];
  customTimeOptionHidden?: boolean;
  isLoading: boolean;
  state: DashboardState;
  onStateChange: <TValue>(key: string, value: TValue) => void;
  defaultValue?: string;
  onRefresh: () => void;
  onCancel: () => void;
}
