export const PAGE_SIZE = 300;

export const TRAFFIC_PERIODS = [
  { key: 'last6h', value: 'network_security_dashboard_filter_6_hours' },
  { key: 'last24h', value: 'network_security_dashboard_filter_24_hours' },
  { key: 'last7d', value: 'network_security_dashboard_filter_7_days' },
  {
    key: 'last14d',
    value: 'network_security_dashboard_filter_14_days',
  },
  {
    key: 'last1M',
    value: 'network_security_dashboard_filter_1_month',
  },
  {
    key: 'last2M',
    value: 'network_security_dashboard_filter_2_months',
  },
];

export const TRAFFIC_PERIOD_LIST = {
  last6h: 'last6h',
  last24h: 'last24h',
  last7d: 'last7d',
  last14d: 'last14d',
  last1M: 'last1M',
  last2M: 'last2M',
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
    data: {
      datasets: [],
    },
    options: {
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
      plugins: {
        legend: {
          position: 'bottom',
          display: true,
        },
        interaction: {
          intersect: false,
          mode: 'nearest',
          axis: 'x',
        },
        tooltip: {
          mode: 'index',
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
                (new Date(context[0].parsed.x).getTimezoneOffset() / 60) * -1;
              const sign = timeZoneOffset > 0 ? '+' : '';

              // Format title like DD/MM/YYYY hh:mm:ss UTC+1 (for FR) or MM/DD/YY, hh:mm:ss UTC-2 (for US)
              const title = `${dateTimeFormat.format(
                new Date(context[0].parsed.x),
              )} UTC${sign}${timeZoneOffset}`;
              return title;
            },
          },
        },
      },
      scales: {
        y: {
          display: true,
          type: 'linear',
          position: 'left',
          min: 0,
          beginAtZero: true,
          title: {
            display: true,
          },
          grid: {
            drawBorder: true,
            display: false,
          },
        },
        x: {
          display: true,
          grid: {
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
                hour12: false,
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
              });
              // Display one label out of 5
              return index % 5 === 0
                ? dateTimeFormat.format(new Date(val))
                : '';
            },
          },
          time: {
            displayFormats: {
              hour: 'YYYY-MM-DD HH:MM',
            },
          },
          type: 'time',
        },
      },
    },
  },
  units: ['b', 'Kb', 'Mb', 'Gb', 'Tb', 'Pb'],
};

export default {
  PAGE_SIZE,
  TRAFFIC_PERIODS,
  TRAFFIC_PERIOD_LIST,
  CHART,
};
