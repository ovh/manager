import { APP_NAME } from './App.constants';

export const LEVEL2 = {
  EU: {
    config: {
      level2: '140',
    },
  },
  CA: {
    config: {
      level2: '140',
    },
  },
  US: {
    config: {
      level2: '140',
    },
  },
};
export const UNIVERSE = 'identity-security-operations';

export const TRACKING_CONTEXT = {
  chapter1: UNIVERSE,
  chapter2: APP_NAME,
  chapter3: APP_NAME,
  appName: APP_NAME,
  pageTheme: UNIVERSE,
  level2Config: LEVEL2,
};
