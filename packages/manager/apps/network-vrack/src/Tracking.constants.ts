import { appName } from '@/App.constants';

export const LEVEL2 = {
  EU: { config: { level2: '152 - Manager-Network' } },
  CA: { config: { level2: '152 - Manager-Network' } },
  US: { config: { level2: '152 - Manager-Network' } },
} as const;

export const UNIVERSE = 'Dedicated' as const;
export const SUB_UNIVERSE = 'Network' as const;

export const APP_NAME = appName;
