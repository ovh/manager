export const VOLUMES_CONFIG = {
  mountDirectory: {
    min: 1,
    max: 50,
    pattern: /^\/(\S)*$/,
  },
  maxVolumes: 10,
  gitUrl: {
    min: 1,
    max: 50,
    pattern: 'http(s)?://([w.:/-~]+)(.git)(/)?',
  },
};
