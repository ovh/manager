export const LABELS = {
  MAX_RETRIES_DOWN: 'Max Retries Down',
  MAX_RETRIES: 'Max Retries',
  DELAY: 'Delay',
  TIMEOUT: 'Timeout',
  URLPATH: 'URL Path',
};

export const HEALTH_MONITOR_TYPE = {
  HTTP: 'http',
  HTTPS: 'https',
  PING: 'ping',
  SCTP: 'sctp',
  TCP: 'tcp',
  TLSHELLO: 'tls-hello',
  UDPCONNECT: 'udp-connect',
};

export const TRACKING_HEALTH_MONITOR_PREFIX = 'health-monitor';

export default {
  LABELS,
  HEALTH_MONITOR_TYPE,
  TRACKING_HEALTH_MONITOR_PREFIX,
};
