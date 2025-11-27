import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export * from './dnsconfig.constants';
export * from './form';
export * from './url';
export * from './string';
export * from './promise';
export * from './object';

export const DATAGRID_REFRESH_INTERVAL = 5_000;
export const DATAGRID_REFRESH_ON_MOUNT = 'always';
export const FEATURE_FLAGS = {
  AUTOREPLIES: false,
  MAILINGLISTS: false,
};

export const APIV2_MAX_PAGESIZE = 9999;
export const APIV2_DEFAULT_PAGESIZE = 25;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
