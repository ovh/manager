export const VPS_MONITORING_BPS_OPTIONS = {
  legend: {
    display: true,
  },
  scales: {
    xAxes: [
      {
        gridLines: {
          display: false,
        },
      },
    ],
    yAxes: [
      {
        id: 'y-axis-1',
        type: 'linear',
        display: true,
        position: 'left',
        ticks: {
          min: 0,
          beginAtZero: true,
        },
        scaleLabel: {
          display: true,
          labelString: 'BPS',
        },
      },
    ],
  },
  elements: {
    line: {
      borderColor: '#00a2bf',
      borderWidth: 4,
    },
    point: {
      radius: 0,
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
  scales: {
    xAxes: [
      {
        gridLines: {
          display: false,
        },
      },
    ],
    yAxes: [
      {
        id: 'y-axe',
        type: 'linear',
        ticks: {
          min: 0,
          max: 100,
          beginAtZero: true,
        },
        scaleLabel: {
          display: true,
          labelString: '%',
        },
      },
    ],
  },
  elements: {
    line: {
      fill: 'bottom',
      backgroundColor: '#59d2ef',
      borderColor: '#00a2bf',
      borderWidth: 4,
    },
    point: {
      radius: 0,
    },
  },
};

export default {
  VPS_MONITORING_BPS_OPTIONS,
  VPS_MONITORING_COLORS,
  VPS_MONITORING_PERCENT_OPTIONS,
};
