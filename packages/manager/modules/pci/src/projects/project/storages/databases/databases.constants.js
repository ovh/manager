import get from 'lodash/get';
import head from 'lodash/head';

export const DATABASES_GUIDES_URL =
  'https://docs.ovh.com/gb/en/publiccloud/databases/';

export const DATABASE_TYPES = {
  MONGO_DB: 'mongodb',
  MYSQL: 'mysql',
  POSTGRE: 'postrgre',
  REDIS: 'redis',
  KAFKA: 'kafka',
};

export const SHELL_NAMES = {
  mongodb: 'mongo',
};

export const METRICS_TIME_RANGES = [
  { label_key: '1H', value: 'lastHour' },
  { label_key: '1D', value: 'lastDay' },
  { label_key: '1W', value: 'lastWeek' },
  { label_key: '1M', value: 'lastMonth' },
  { label_key: '1Y', value: 'lastYear' },
];

export const CHART_METRICS_REFRESH_INTERVAL = 60000;

export const CHART_METRICS_OPTIONS = {
  chart: {
    type: 'line',
    data: {
      datasets: [],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        position: 'bottom',
        display: true,
      },
      elements: {
        point: {
          radius: 0,
        },
      },
      tooltips: {
        mode: 'label',
        intersect: false,
        callbacks: {
          title(data) {
            const timestamp = moment(
              get(head(data), 'xLabel'),
              'MMM DD, YYYY, HH:mm:ss a',
            );
            return timestamp.fromNow();
          },
        },
      },
      scales: {
        yAxes: [
          {
            display: true,
            position: 'left',
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
  },
};

export default {
  DATABASES_GUIDES_URL,
  DATABASE_TYPES,
  SHELL_NAMES,
  METRICS_TIME_RANGES,
  CHART_METRICS_OPTIONS,
};
