import { appName } from '@/App.constants';

export const LEVEL2 = {
  EU: { config: { level2: '86' } },
  CA: { config: { level2: '86' } },
  US: { config: { level2: '86' } },
} as const;

export const UNIVERSE = 'PublicCloud' as const;
export const SUB_UNIVERSE = 'storages' as const;

export const APP_NAME = appName;
