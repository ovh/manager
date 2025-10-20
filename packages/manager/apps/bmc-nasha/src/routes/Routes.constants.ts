import { APP_FEATURES, appName } from '@/App.constants';

import { getRoot } from './Routes.utils';

export const urls = {
  root: getRoot(),
  listing: 'listing',
} as const;

export const redirectionApp = APP_FEATURES.isPci
  ? APP_FEATURES.appSlug // for PCI, shell expects the short app slug
  : appName;
