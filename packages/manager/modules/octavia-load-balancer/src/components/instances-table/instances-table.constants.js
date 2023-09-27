export const PROTOCOLS = {
  HTTP: 'http',
  HTTPS: 'https',
  TCP: 'tcp',
  UDP: 'udp',
  PROMETHEUS: 'prometheus',
};

export const HEALTH_MONITORS = {
  NONE: 'NONE',
  HTTP_GET: 'HTTP GET',
  HTTPS_GET: 'HTTPS GET',
  PING: 'PING',
  SCTP: 'SCTP',
  TCP: 'TCP',
  TLS_HELLO: 'TLS-HELLO',
  UDP_CONNECT: 'UDP-CONNECT',
};

export const LISTENER_PROTOCOL_LIST = [
  {
    name: 'HTTP',
    value: PROTOCOLS.HTTP,
    defaultPort: 80,
    healthMonitors: [
      HEALTH_MONITORS.NONE,
      HEALTH_MONITORS.HTTP_GET,
      HEALTH_MONITORS.HTTPS_GET,
      HEALTH_MONITORS.PING,
      HEALTH_MONITORS.TCP,
      HEALTH_MONITORS.TLS_HELLO,
    ],
  },
  {
    name: 'HTTPS',
    value: PROTOCOLS.HTTPS,
    defaultPort: 443,
    healthMonitors: [
      HEALTH_MONITORS.NONE,
      HEALTH_MONITORS.HTTP_GET,
      HEALTH_MONITORS.HTTPS_GET,
      HEALTH_MONITORS.PING,
      HEALTH_MONITORS.TCP,
      HEALTH_MONITORS.TLS_HELLO,
    ],
  },
  {
    name: 'TCP',
    value: PROTOCOLS.TCP,
    healthMonitors: [
      HEALTH_MONITORS.NONE,
      HEALTH_MONITORS.HTTP_GET,
      HEALTH_MONITORS.HTTPS_GET,
      HEALTH_MONITORS.PING,
      HEALTH_MONITORS.TCP,
      HEALTH_MONITORS.TLS_HELLO,
    ],
  },
  {
    name: 'UDP',
    value: PROTOCOLS.UDP,
    healthMonitors: [
      HEALTH_MONITORS.NONE,
      HEALTH_MONITORS.HTTP_GET,
      HEALTH_MONITORS.SCTP,
      HEALTH_MONITORS.TCP,
      HEALTH_MONITORS.UDP_CONNECT,
    ],
  },
  {
    name: 'Prometheus',
    value: PROTOCOLS.PROMETHEUS,
  },
];

export const TRACKING_ADD_LISTENER =
  'pci::projects::project::octavia-loadbalancer::add::add-listener';

export default {
  PROTOCOLS,
  LISTENER_PROTOCOL_LIST,
  TRACKING_ADD_LISTENER,
};
