export const PAGE_SIZE = 300;

export const TRAFFIC_PERIODS = [
  { key: 'last6h', value: 'network_security_dashboard_filter_last_6h' },
  { key: 'last24h', value: 'network_security_dashboard_filter_last_24h' },
  { key: 'lastWeek', value: 'network_security_dashboard_filter_last_week' },
  {
    key: 'last2weeks',
    value: 'network_security_dashboard_filter_last_2_weeks',
  },
];

export const TRAFFIC_PERIOD_LIST = {
  last6h: 'last6h',
  last24h: 'last24h',
  lastWeek: 'lastWeek',
  last2weeks: 'last2weeks',
};

export const CHART = {
  colors: [
    {
      borderColor: '#D2F2C2',
      backgroundColor: '#D2F2C2',
    },
    {
      borderColor: '#FFCCD9',
      backgroundColor: '#FFCCD9',
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
    interaction: {
      intersect: false,
      mode: 'nearest',
      axis: 'x',
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
          display: true,
          gridLines: {
            offsetGridLines: true,
            display: false,
          },
          position: 'bottom',
          ticks: {
            display: true,
            source: 'auto',
            autoSkip: true,
          },
          time: {
            displayFormats: {
              hour: 'YYYY-MM-DD HH:MM',
            },
          },
          type: 'time',
        },
      ],
    },
  },
  units: ['b', 'Kb', 'Mb', 'Gb', 'Tb', 'Pb'],
};

export default { PAGE_SIZE, TRAFFIC_PERIODS, TRAFFIC_PERIOD_LIST, CHART };
