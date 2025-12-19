export const LEVEL2 = {
  EU: {
    config: {
      level2: '157',
    },
  },
  CA: {
    config: {
      level2: '157',
    },
  },
  US: {
    config: {
      level2: '157',
    },
  },
};
export const UNIVERSE = 'Manager-Communications';
export const SUB_UNIVERSE = 'Communications';
export const APP_NAME = 'communication';

export enum TrackingSubApps {
  Communications = 'communications',
  Contacts = 'contacts',
  Settings = 'rules-parameter',
}

export const TRACKING_CONTEXT = {
  chapter1: SUB_UNIVERSE,
  chapter2: TrackingSubApps.Communications,
  chapter3: TrackingSubApps.Communications,
  appName: APP_NAME,
  pageTheme: UNIVERSE,
  level2Config: LEVEL2,
};
