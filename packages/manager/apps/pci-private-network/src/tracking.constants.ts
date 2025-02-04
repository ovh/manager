enum PublicCloudTrackingCodeLevel2 {
  EU = '86',
  US = '52',
}

export const LEVEL2 = {
  EU: {
    config: {
      level2: PublicCloudTrackingCodeLevel2.EU,
    },
  },
  CA: {
    config: {
      level2: PublicCloudTrackingCodeLevel2.EU,
    },
  },
  US: {
    config: {
      level2: PublicCloudTrackingCodeLevel2.US,
    },
  },
};

export const UNIVERSE = 'PublicCloud';
export const SUB_UNIVERSE = 'network';
export const APP_NAME = 'privateNetwork';
export const CHANGELOG_CHAPTERS = [UNIVERSE, SUB_UNIVERSE, APP_NAME];
