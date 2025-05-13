export const PERIOD = {
  HOURLY: 'hourly',
  DAILY: 'daily',
  MONTHLY: 'monthly',
};

export const TYPE = {
  LIGHT: 'light',
  LIGHT_IN: 'light:in',
  LIGHT_OUT: 'light:out',
  TRAFFIC: 'traffic',
  TRAFFIC_DOWN: 'traffic:download',
  TRAFFIC_UP: 'traffic:upload',
  ERROR: 'error',
  ERROR_DOWN: 'error:download',
  ERROR_UP: 'error:upload',
};

export const PERIOD_ENUM = ['hourly', 'daily', 'weekly'];

export const TYPE_ENUM = ['error', 'light', 'traffic'];

export const TYPE_LABELS = {
  down: 'down',
  up: 'up',
};

export const LABELS = {
  traffic_unit: 'bytes/s',
  light_unit: 'dbm',
  error_unit: 'error/s',
  id_port: 'ID Port',
  download: 'download',
  upload: 'upload',
  in: 'in',
  out: 'out',
};

export const STATISTICS = {
  colors: [
    {
      borderColor: '#33acff',
      backgroundColor: 'rgba(51, 172, 255, 0.1)',
    },
    {
      borderColor: '#354291',
      backgroundColor: 'rgba(53, 66, 145, 0.1)',
    },
    {
      borderColor: '#fd8c06',
      backgroundColor: 'rgba(253, 140, 6, 0.1)',
    },
    {
      borderColor: '#24b994',
      backgroundColor: 'rgba(36, 185, 148, 0.1)',
    },
    {
      borderColor: '#b92463',
      backgroundColor: 'rgba(185, 36, 99, 0.1)',
    },
    {
      borderColor: '#5a2d7a',
      backgroundColor: 'rgba(90, 45, 122, 0.1)',
    },
    {
      borderColor: '#0d618c',
      backgroundColor: 'rgba(13, 97, 140, 0.1)',
    },
    {
      borderColor: '#e53232',
      backgroundColor: 'rgba(229, 50, 50, 0.1)',
    },
  ],
  options: {
    responsive: true,
    maintainAspectRatio: false,
    data: {
      datasets: [],
    },
    options: {
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
          fill: false,
          tension: 0,
          borderWidth: 1,
        },
        point: {
          radius: 0,
        },
      },
      scales: {
        y: {
          display: true,
          beginAtZero: true,
          type: 'linear',
          position: 'left',
          title: {
            display: true,
          },
          grid: {
            drawBorder: true,
            display: false,
          },
        },
        x: {
          type: 'time',
          position: 'bottom',
          grid: {
            drawBorder: true,
            display: false,
          },
        },
      },
    },
  },
};

export default {
  PERIOD,
  PERIOD_ENUM,
  STATISTICS,
  TYPE,
  TYPE_ENUM,
  TYPE_LABELS,
};
