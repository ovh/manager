import { APP_FEATURES } from '@/App.constants';

export const getRoot = (): string => {
  const { basePrefix, appSlug } = APP_FEATURES;
  return `${appSlug}`;
};
