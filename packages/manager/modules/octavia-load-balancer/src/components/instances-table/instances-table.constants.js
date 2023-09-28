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

export const MAX_LISTENER = 5;
export const MAX_INSTANCES_BY_LISTENER = 5;

export const TRACKING_ADD_LISTENER =
  'pci::projects::project::octavia-loadbalancer::add::add-listener';

export default {
  PROTOCOLS,
  LISTENER_PROTOCOL_LIST,
  TRACKING_ADD_LISTENER,
  MAX_LISTENER,
  MAX_INSTANCES_BY_LISTENER,
};
