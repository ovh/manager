import { APP_FEATURES, appName } from '@/App.constants';

export const LEVEL2 = {
  EU: { config: { level2: APP_FEATURES.tracking.level2ByRegion.EU.level2 } },
  CA: { config: { level2: APP_FEATURES.tracking.level2ByRegion.CA.level2 } },
  US: { config: { level2: APP_FEATURES.tracking.level2ByRegion.US.level2 } },
} as const;

export const UNIVERSE = APP_FEATURES.tracking.universe;
export const SUB_UNIVERSE = APP_FEATURES.tracking.subUniverse;

export const APP_NAME = APP_FEATURES.tracking.appNameForTracking ?? appName;
