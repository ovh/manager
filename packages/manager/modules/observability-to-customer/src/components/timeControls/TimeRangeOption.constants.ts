import { TimeRangeOptionWithLabel } from './TimeRangeOptionWithLabel.type';

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
    label: `time-controls-option-day`,
    value: '24h',
    rangeInSeconds: 24 * 60 * 60,
  },
];

export const TimeRangeOptionCustom: TimeRangeOptionWithLabel = {
  label: 'time-controls-option-custom',
  value: 'custom',
  rangeInSeconds: -1,
};
