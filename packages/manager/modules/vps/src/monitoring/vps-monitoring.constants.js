export const VPS_MONITORING_CHARTS = [
  {
    title: 'vps_configuration_monitoring_usage_proc',
    min: 0,
    max: 100,
    queries: (serviceName) => [
      `sum(rec_libvirtd_domain_cpu_usage{service_name="${serviceName}"})`,
    ],
    yTitle: '%',
    bgColor: '#59d2ef',
    borderColor: '#00a2bf',
    legend: {
      display: false,
      labels: [],
    },
  },
  {
    title: 'vps_configuration_monitoring_usage_ram',
    min: 0,
    max: 100,
    queries: (serviceName) => [
      `sum((rec_libvirtd_domain_balloon_rss{service_name="${serviceName}"} / rec_libvirtd_domain_balloon_current{service_name="${serviceName}"}) * 100)`,
    ],
    yTitle: '%',
    bgColor: '#59d2ef',
    borderColor: '#00a2bf',
    legend: {
      display: false,
      labels: [],
    },
  },
  {
    title: 'vps_configuration_monitoring_usage_trafic',
    min: 0,
    queries: (serviceName) => [
      `sum(rate(rec_libvirtd_domain_net_rx_bytes{service_name="${serviceName}"}[5m]) * 8)`,
      `sum(rate(rec_libvirtd_domain_net_tx_bytes{service_name="${serviceName}"}[5m]) * 8)`,
    ],
    yTitle: 'BPS',
    bgColor: ['rgba(241,196,15, .5)', 'rgba(52,152,219, .5)'],
    borderColor: ['#F1C40F', '#00a2bf'],
    legend: {
      display: true,
      labels: ['vps_monitoring_network_netRx', 'vps_monitoring_network_netTx'],
    },
  },
];

export const VPS_MONITORING_COLORS = [
  '#F1C40F',
  '#3498DB',
  '#717984',
  '#72C02C',
];

export const VPS_MONITORING_PERIODS = [
  {
    label: 'TODAY',
    value: '1d',
    step: '1m',
    timeRange: -(new Date() - new Date().setHours(0, 0, 0, 0)),
  },
  {
    label: 'LASTDAY',
    value: '1d',
    step: '1m',
    timeRange: -24 * 60 * 60 * 1000,
  },
  {
    label: 'LASTWEEK',
    value: '7d',
    step: '1m',
    timeRange: -7 * 24 * 60 * 60 * 1000,
    isDefault: true,
  },
  {
    label: 'LASTMONTH',
    value: '30d',
    step: '5m',
    timeRange: -1 * 30 * 24 * 60 * 60 * 1000,
  },
  {
    label: 'LASTYEAR',
    value: '365d',
    step: '60m',
    timeRange: -365 * 24 * 60 * 60 * 1000,
  },
];
export default {
  VPS_MONITORING_CHARTS,
  VPS_MONITORING_COLORS,
  VPS_MONITORING_PERIODS,
};
