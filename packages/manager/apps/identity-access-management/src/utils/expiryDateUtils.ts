import { ExpiryDateModel } from '@/types/expiryDate';

export const SECONDS_IN_MINUTE = 60;
export const SECONDS_IN_HOUR = 60 * 60;
export const SECONDS_IN_DAY = 60 * 60 * 24;

export const DEFAULT_EXPIRY_DATE_MODEL: ExpiryDateModel = {
  active: false,
  mode: 'duration',
  expiresAt: new Date(),
  expiresIn: SECONDS_IN_HOUR,
};

export const MINUTES_OPTIONS = Array.from({ length: 59 }, (_, i) => ({
  value: i + 1,
  label: `${i + 1}`,
}));

export const HOURS_OPTIONS = Array.from({ length: 23 }, (_, i) => ({
  value: i + 1,
  label: `${i + 1}`,
}));
