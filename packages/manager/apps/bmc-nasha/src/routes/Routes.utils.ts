import { APP_FEATURES } from '@/App.constants';

export const getRoot = (): string => {
  return APP_FEATURES.basePrefix || '/';
};
