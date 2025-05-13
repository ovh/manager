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

export const PORT_RANGE = {
  MIN: 1,
  MAX: 65535,
};

export const MAX_LISTENER = 5;
export const MAX_INSTANCES_BY_LISTENER = 5;
