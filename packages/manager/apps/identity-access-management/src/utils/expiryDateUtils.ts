import { endOfDay, format, setHours, setMinutes } from 'date-fns';
import { ExpiryDateModel, ExpiryMode } from '@/types/expiryDate';

export const SECONDS_IN_MINUTE = 60;
export const SECONDS_IN_HOUR = 60 * 60;
export const SECONDS_IN_DAY = 60 * 60 * 24;

export const DEFAULT_EXPIRY_DATE_MODEL: ExpiryDateModel = {
  active: false,
  mode: ExpiryMode.DURATION,
  expiresAt: endOfDay(new Date()),
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

export const extractTimeFromDate = (date: Date | null): string | null => {
  if (!date) {
    return null;
  }
  return format(date, 'HH:mm');
};

export const updateDateTime = (
  date: Date | null,
  time: string | null,
): Date | null => {
  if (!date) {
    return null;
  }
  if (!time) {
    return date;
  }
  const [hours, minutes] = time.split(':').map((str) => parseInt(str, 10));
  let updatedDate = setHours(date, hours);
  updatedDate = setMinutes(updatedDate, minutes);
  return updatedDate;
};
