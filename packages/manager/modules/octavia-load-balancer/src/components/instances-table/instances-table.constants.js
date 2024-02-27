export const PROTOCOLS = {
  HTTP: 'http',
  HTTPS: 'https',
  TCP: 'tcp',
  UDP: 'udp',
  PROMETHEUS: 'prometheus',
};

export const HEALTH_MONITORS = {
  HTTP_GET: 'http',
  HTTPS_GET: 'https',
  PING: 'ping',
  SCTP: 'sctp',
  TCP: 'tcp',
  TLS_HELLO: 'tls-hello',
  UDP_CONNECT: 'udp-connect',
};

export const LISTENER_PROTOCOL_LIST = [
  {
    name: 'HTTP',
    value: PROTOCOLS.HTTP,
    defaultPort: 80,
    healthMonitors: [
      { name: 'HTTP GET', value: HEALTH_MONITORS.HTTP_GET },
      { name: 'HTTPS GET', value: HEALTH_MONITORS.HTTPS_GET },
      { name: 'PING', value: HEALTH_MONITORS.PING },
      { name: 'TCP', value: HEALTH_MONITORS.TCP },
      { name: 'TLS-HELLO', value: HEALTH_MONITORS.TLS_HELLO },
    ],
  },
  {
    name: 'HTTPS',
    value: PROTOCOLS.HTTPS,
    defaultPort: 443,
    healthMonitors: [
      { name: 'HTTP GET', value: HEALTH_MONITORS.HTTP_GET },
      { name: 'HTTPS GET', value: HEALTH_MONITORS.HTTPS_GET },
      { name: 'PING', value: HEALTH_MONITORS.PING },
      { name: 'TCP', value: HEALTH_MONITORS.TCP },
      { name: 'TLS-HELLO', value: HEALTH_MONITORS.TLS_HELLO },
    ],
  },
  {
    name: 'TCP',
    value: PROTOCOLS.TCP,
    healthMonitors: [
      { name: 'HTTP GET', value: HEALTH_MONITORS.HTTP_GET },
      { name: 'HTTPS GET', value: HEALTH_MONITORS.HTTPS_GET },
      { name: 'PING', value: HEALTH_MONITORS.PING },
      { name: 'TCP', value: HEALTH_MONITORS.TCP },
      { name: 'TLS-HELLO', value: HEALTH_MONITORS.TLS_HELLO },
    ],
  },
  {
    name: 'UDP',
    value: PROTOCOLS.UDP,
    healthMonitors: [
      { name: 'HTTP GET', value: HEALTH_MONITORS.HTTP_GET },
      { name: 'SCTP', value: HEALTH_MONITORS.SCTP },
      { name: 'TCP', value: HEALTH_MONITORS.TCP },
      { name: 'UDP-CONNECT', value: HEALTH_MONITORS.UDP_CONNECT },
    ],
  },
  {
    name: 'Prometheus',
    value: PROTOCOLS.PROMETHEUS,
  },
];

export const TRACKING_ADD_LISTENER = 'add-listener';

export const TRACKING_DELETE_LISTENER = 'delete-listener';

export const TRACKING_ADD_INSTANCE = 'add-instance';

export const TRACKING_DELETE_INSTANCE = 'delete-instance';

export default {
  PROTOCOLS,
  LISTENER_PROTOCOL_LIST,
  TRACKING_ADD_LISTENER,
  TRACKING_DELETE_LISTENER,
  TRACKING_ADD_INSTANCE,
  TRACKING_DELETE_INSTANCE,
};
