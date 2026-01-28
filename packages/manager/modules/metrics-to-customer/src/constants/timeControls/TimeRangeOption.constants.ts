import { TimeRangeOptionWithLabel } from '@/types/timeControls/TimeRangeOptionWithLabel.type';

export const defaultTimeRangeOptions: TimeRangeOptionWithLabel[] = [
  {
    label: '1h',
    value: '1h',
    rangeInSeconds: 1 * 60 * 60,
  },
  {
    label: '12h',
    value: '12h',
    rangeInSeconds: 12 * 60 * 60,
  },
  {
    label: `option_day`,
    value: '24h',
    rangeInSeconds: 24 * 60 * 60,
  },
];

export const TimeRangeOptionCustom: TimeRangeOptionWithLabel = {
  label: 'option_custom',
  value: 'custom',
  rangeInSeconds: -1,
};
