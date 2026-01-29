const APP = 'telecom';
export const FEATURES = {
  APP,
  LOGS: `${APP}:logs`,
};

export default {
  statistics: {
    sampleRate: '5m-avg',
  },
  maxRemotes: 10,
  local: 'local',
};
