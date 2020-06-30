export const METRICS_REFRESH_INTERVAL = 60000;

export const WARP10_URL = 'https://warp10.gra1.metrics.ovh.net/api/v0/exec';

export const METRICS_COLOR_MAPPING = {
  'serving.model.scaler.min': 'rgba(2,182,219,1)',
  'serving.model.scaler.max': 'rgb(219,79,64)',
  'serving.model.scaler.current': 'rgb(46,219,74)',
  'serving.model.memory.usage': 'rgb(46,219,74)',
  'serving.model.cpu.usage': 'rgba(2,182,219,1)',
  '5xx': 'rgb(219,0,19)',
  '4xx': 'rgb(219,131,17)',
  '2xx': 'rgb(46,219,74)',
};
