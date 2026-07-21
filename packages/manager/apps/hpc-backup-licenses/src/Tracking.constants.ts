import { appName } from '@/App.constants';

export const LEVEL2 = {
  EU: { config: { level2: '120' } },
  CA: { config: { level2: '120' } },
  US: { config: { level2: '120' } },
} as const;

export const UNIVERSE = 'HostedPrivatedCloud' as const;
export const SUB_UNIVERSE = 'HostedPrivatedCloud' as const;

export const APP_NAME = appName;
