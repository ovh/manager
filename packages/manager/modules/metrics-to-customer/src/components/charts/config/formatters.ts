import { format } from 'date-fns';
import { RoundingMode } from './roundModes';

export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  return format(date, 'HH:mm:ss');
};

export const formatTimestampToDateTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return format(date, 'PPPP p');
};

export const formatLargeNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(value);
};

export type FormatterConfig =
  | string
  | {
      type: string;
      precision?: number;
      roundingMode?: RoundingMode;
    };

const roundNumber = (
  value: number,
  precision: number,
  roundingMode: RoundingMode,
): number => {
  const factor = Math.pow(10, precision);
  const scaled = value * factor;

  switch (roundingMode) {
    case 'half-up':
      return Math.round(scaled) / factor;

    case 'half-down': {
      const sign = Math.sign(scaled);
      const abs = Math.abs(scaled);
      const floored = Math.floor(abs);
      return (abs - floored === 0.5
        ? floored
        : Math.round(abs)) * sign / factor;
    }

    case 'half-even': {
      const floor = Math.floor(scaled);
      const diff = scaled - floor;
      if (diff === 0.5) {
        return (floor % 2 === 0 ? floor : floor + 1) / factor;
      }
      return Math.round(scaled) / factor;
    }

    case 'up':
      return Math.ceil(Math.abs(scaled)) * Math.sign(scaled) / factor;

    case 'down':
      return Math.floor(Math.abs(scaled)) * Math.sign(scaled) / factor;

    case 'ceil':
      return Math.ceil(scaled) / factor;

    case 'floor':
      return Math.floor(scaled) / factor;

    default:
      return Math.round(scaled) / factor;
  }
};

export const formatNumber = (
  value: number,
  {
    precision = 2,
    roundingMode = 'half-up',
  }: {
    precision?: number;
    roundingMode?: RoundingMode;
  } = {},
): string => {
  const rounded = roundNumber(value, precision, roundingMode);

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  }).format(rounded);
};

export const formatters = {
  formatTimestamp,
  formatTimestampToDateTime,
  formatLargeNumber,
  formatNumber,
};

export const getFormatter = (
  formatter?: FormatterConfig,
): ((value: any) => string) | undefined => {
  if (!formatter) {
    return undefined; // TODO: default formatter
  }

  if (typeof formatter === 'string') {
    return formatter in formatters
      ? formatters[formatter as keyof typeof formatters]
      : undefined;
  }

  const { type, ...options } = formatter;

  if (!(type in formatters)) {
    return undefined;
  }

  const baseFormatter = formatters[type as keyof typeof formatters];

  return (value: any) =>
    typeof baseFormatter === 'function'
      ? baseFormatter(value, options)
      : value;
};
