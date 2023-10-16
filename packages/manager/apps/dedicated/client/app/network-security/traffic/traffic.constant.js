export const TRAFFIC_PERIODS = [
  { key: 'last24h', value: 'network_security_dashboard_filter_last_24h' },
  { key: 'lastWeek', value: 'network_security_dashboard_filter_last_week' },
  {
    key: 'last2weeks',
    value: 'network_security_dashboard_filter_last_2_weeks',
  },
];

export const TRAFFIC_PERIOD_LIST = {
  last24h: 'last24h',
  lastWeek: 'lastWeek',
  last2weeks: 'last2weeks',
};

export const CHART = {
  colors: [
    {
      borderColor: '#D2F2C2',
      backgroundColor: 'rgba(210, 242, 194, 0.4)',
    },
    {
      borderColor: '#FFCCD9',
      backgroundColor: 'rgba(255, 204, 217, 0.4)',
    },
  ],
  options: {
    responsive: true,
    maintainAspectRatio: true,
    legend: {
      position: 'bottom',
      display: true,
    },
    elements: {
      line: {
        fill: true,
        tension: 0,
        borderWidth: 2,
      },
      point: {
        radius: 0,
      },
    },
    tooltips: {
      mode: 'label',
      intersect: false,
    },
    scales: {
      yAxes: [
        {
          display: true,
          type: 'linear',
          position: 'left',
          ticks: {
            min: 0,
            beginAtZero: true,
          },
          scaleLabel: {
            display: true,
          },
          gridLines: {
            drawBorder: true,
            display: false,
          },
        },
      ],
      xAxes: [
        {
          type: 'time',
          position: 'bottom',
          gridLines: {
            drawBorder: true,
            display: false,
          },
        },
      ],
    },
  },
  units: ['b', 'kb', 'mb', 'gb', 'tb', 'pb'],
};

export default { TRAFFIC_PERIODS, TRAFFIC_PERIOD_LIST, CHART };
