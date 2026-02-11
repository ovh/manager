import { TimeRangeOptionWithLabel } from '@/types/timeControls/TimeRangeOptionWithLabel.type';

import { DashboardState } from '@/contexts';

export interface TimeControlsProps {
  id: string;
  timeOptions?: TimeRangeOptionWithLabel[];
  customTimeOptionHidden?: boolean;
  isLoading: boolean;
  state: DashboardState;
  onStateChange: <TValue>(key: string, value: TValue) => void;
  defaultValue?: string;
  onRefresh: () => void;
  onCancel: () => void;
}
