export const UNIVERSE = 'PublicCloud';
export const SUB_UNIVERSE = 'storages';
export const APP_NAME = 'block_storage';
export const LEVEL2 = {
  EU: {
    config: {
      level2: '86',
    },
  },
  CA: {
    config: {
      level2: '86',
    },
  },
  US: {
    config: {
      level2: '56',
    },
  },
};

export const TRACKING_CONTEXT = {
  chapter1: UNIVERSE,
  chapter2: SUB_UNIVERSE,
  chapter3: APP_NAME,
  appName: APP_NAME,
  pageTheme: UNIVERSE,
  level2Config: LEVEL2,
};
