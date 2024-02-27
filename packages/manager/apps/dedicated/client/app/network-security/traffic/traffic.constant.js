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
      callbacks: {
        title: (context) => {
          // Retrieve user language
          const userLanguage = navigator.language;

          // Configure dateTime format to display like DD/MM/YYYY hh:mm:ss (for FR) or MM/DD/YY, hh:mm:ss (for US)
          const dateTimeFormat = new Intl.DateTimeFormat(userLanguage, {
            hourCycle: 'h23',
            timeStyle: 'medium',
            dateStyle: 'short',
          });

          // Retrieve user local time zone
          const timeZoneOffset =
            (new Date(context[0].label).getTimezoneOffset() / 60) * -1;
          const sign = timeZoneOffset > 0 ? '+' : '';

          // Format title like DD/MM/YYYY hh:mm:ss UTC+1 (for FR) or MM/DD/YY, hh:mm:ss UTC-2 (for US)
          const title = `${dateTimeFormat.format(
            new Date(context[0].label),
          )} UTC${sign}${timeZoneOffset}`;
          return title;
        },
      },
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
            callback: (val, index) => {
              const { language } = navigator;
              const dateTimeFormat = new Intl.DateTimeFormat(language, {
                hourCycle: 'h23',
                timeStyle: 'medium',
                dateStyle: 'short',
              });
              // Display one label out of 5
              return index % 5 === 0
                ? dateTimeFormat.format(new Date(val))
                : '';
            },
          },
        },
      ],
    },
  },
  units: ['b', 'Kb', 'Mb', 'Gb', 'Tb', 'Pb'],
};

export default { PAGE_SIZE, TRAFFIC_PERIODS, TRAFFIC_PERIOD_LIST, CHART };
