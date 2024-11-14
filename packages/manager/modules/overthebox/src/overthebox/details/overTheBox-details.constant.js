export default {
  chart: {
    data: { datasets: [] },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          display: true,
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        },
      },
      elements: {
        line: {
          tension: 0.5,
        },
        point: {
          radius: 0,
        },
      },
      scales: {
        x: {
          type: 'time',
          position: 'bottom',
          grid: {
            drawBorder: true,
            display: false,
          },
        },
        y: {
          display: true,
          position: 'left',
          title: {
            display: true,
          },
          grid: {
            drawBorder: true,
            display: false,
          },
        },
      },
    },
  },
  lastSeen: {
    limit: 5,
  },
  serviceIpStatus: {
    unknown: 'unknown',
    locked: 'locked',
    warning: 'warning',
  },
  period: {
    daily: 'daily',
    hourly: 'hourly',
    monthly: 'monthly',
    weekly: 'weekly',
  },
  type: {
    traffic: 'traffic',
    memory_free: 'memory_free',
    load: 'load',
  },
  guidesUrl: {
    fr: 'https://docs.ovh.com/fr/overthebox/',
  },
  convertToMbps: 104857.6,
  convertToKbps: 102.4,
  status: {
    locked: 'locked',
    warning: 'warning',
    unknown: 'unknown',
  },
  pattern: /[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}/,
  deprecated: '_deprecated',
  version: 'v',
};
