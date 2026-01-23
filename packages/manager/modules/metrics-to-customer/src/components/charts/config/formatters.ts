import { format } from 'date-fns';
import { RoundingMode } from './roundModes';
import { getLocaleObject } from '@/utils/dateTimeUtils';

export type FormatterOptions = {
  precision?: number;
  roundingMode?: RoundingMode;
  locale?: string;
};

export const formatTimestamp = (
  timestamp: number,
  options?: FormatterOptions,
): string => {
  const date = new Date(timestamp);
  const locale = getLocaleObject(options?.locale);
  return format(date, 'pp', { locale });
};

export const formatTimestampToDateTime = (
  timestamp: number,
  options?: FormatterOptions,
): string => {
  const date = new Date(timestamp);
  const locale = getLocaleObject(options?.locale);
  return format(date, 'Ppp', { locale });
};

export const formatLargeNumber = (
  value: number,
  options?: FormatterOptions,
): string => {
  const locale = getLocaleObject(options?.locale);
  return new Intl.NumberFormat(locale.code, {
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
      locale?: string;
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
  options?: FormatterOptions,
): string => {
  const locale = getLocaleObject(options?.locale);
  const precision = options?.precision ?? 2;
  const roundingMode = options?.roundingMode ?? 'half-up';
  const rounded = roundNumber(value, precision, roundingMode);

  return new Intl.NumberFormat(locale.code, {
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
  options?: FormatterOptions,
): ((value: any) => string) | undefined => {
  if (!formatter) {
    return undefined;
  }

  const type = typeof formatter === 'string' ? formatter : formatter.type;
  const baseFormatter = formatters[type as keyof typeof formatters];

  if (!baseFormatter) {
    return undefined;
  }

  let formatterOptions: FormatterOptions | undefined = options;
  
  if (typeof formatter !== 'string') {
    const { type: _, ...configOptions } = formatter;
    formatterOptions = { ...configOptions, ...options };
  }

  return (value: any) => baseFormatter(value, formatterOptions);
};
