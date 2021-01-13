export const graphs = [
  {
    name: 'Quantum',
    url: 'https://quantum.metrics.ovh.net',
  },
  {
    name: 'Grafana',
    url: 'https://grafana.metrics.ovh.net',
  },
];

export const protos = [
  'prometheus',
  'influxdb',
  'graphite',
  'warp10',
  'opentsdb',
];

export const suffix = 'metrics.ovh.net';

export const GUIDE = {
  FR: 'https://docs.ovh.com/fr/',
};

export default {
  graphs,
  protos,
  suffix,
  GUIDE,
};
