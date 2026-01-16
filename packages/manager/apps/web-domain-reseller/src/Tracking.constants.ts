import { appName } from '@/App.constants';

export const LEVEL2 = {
  EU: { config: { level2: '81 - Manager' } },
  CA: { config: { level2: '81 - Manager' } },
  US: { config: { level2: '81 - Manager' } },
} as const;

export const UNIVERSE = 'WebCloud' as const;
export const SUB_UNIVERSE = 'WebCloud' as const;

export const APP_NAME = appName;
