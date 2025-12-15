import { appName } from '@/App.constants';

export const LEVEL2 = {
  EU: { config: { level2: '86 - ManagerPublicCloud' } },
  CA: { config: { level2: '86 - ManagerPublicCloud' } },
  US: { config: { level2: '86 - ManagerPublicCloud' } },
} as const;

export const UNIVERSE = 'Dedicated' as const;
export const SUB_UNIVERSE = 'Network' as const;

export const APP_NAME = appName;
