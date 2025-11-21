import { appName } from '@/App.constants';

export const LEVEL2 = {
  EU: { config: { level2: '{{trackingLevel2}}' } },
  CA: { config: { level2: '{{trackingLevel2}}' } },
  US: { config: { level2: '{{trackingLevel2}}' } },
} as const;

export const UNIVERSE = '{{trackingUniverse}}' as const;
export const SUB_UNIVERSE = '{{trackingSubUniverse}}' as const;

export const APP_NAME = appName;
