export const VPS_MONITORING_BPS_OPTIONS = {
  data: {
    datasets: [],
  },
  options: {
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        id: 'y-axis-1',
        type: 'linear',
        display: true,
        position: 'left',
        min: 0,
        beginAtZero: true,
        title: {
          display: true,
          text: 'BPS',
        },
      },
    },
    elements: {
      line: {
        fill: true,
        borderColor: '#00a2bf',
        borderWidth: 4,
        tension: 0.5,
      },
      point: {
        radius: 0,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
  },
};

export const VPS_MONITORING_COLORS = [
  '#F1C40F',
  '#3498DB',
  '#717984',
  '#72C02C',
];

export const VPS_MONITORING_PERCENT_OPTIONS = {
  data: {
    datasets: [],
  },
  options: {
    scales: {
      x: {
        grid: {
          display: false,
        },
      },

      y: {
        id: 'y-axe',
        type: 'linear',
        min: 0,
        max: 100,
        beginAtZero: true,
        title: {
          display: true,
          text: '%',
        },
      },
    },
    elements: {
      line: {
        fill: true,
        backgroundColor: '#59d2ef',
        borderColor: '#00a2bf',
        borderWidth: 4,
      },
      point: {
        radius: 0,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
  },
};

export default {
  VPS_MONITORING_BPS_OPTIONS,
  VPS_MONITORING_COLORS,
  VPS_MONITORING_PERCENT_OPTIONS,
};
