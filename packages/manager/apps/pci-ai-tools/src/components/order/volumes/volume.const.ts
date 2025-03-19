export const VOLUMES_CONFIG = {
  datastore: {
    min: 1,
  },
  container: {
    pattern: /^[^/\\]+$/,
  },
  mountDirectory: {
    min: 1,
    max: 50,
    pattern: /^\/(\S)*$/,
    savedPath: '/workspace',
  },
  maxVolumes: 10,
  gitUrl: {
    min: 1,
    max: 50,
    pattern: 'http(s)?://([w.:/-~]+)(.git)(/)?',
  },
};
