angular.module('managerApp').constant('METRICS_ENDPOINTS', {
  graphs: [
    {
      name: 'Quantum',
      url: 'https://quantum.metrics.ovh.net',
    },
    {
      name: 'Grafana',
      url: 'https://grafana.metrics.ovh.net',
    },
  ],
  protos: ['prometheus', 'influxdb', 'graphite', 'warp10', 'opentsdb'],
  suffix: 'metrics.ovh.net',
});
