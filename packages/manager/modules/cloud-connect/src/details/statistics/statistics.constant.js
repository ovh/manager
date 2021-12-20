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
  traffic_download: 'cloud_connect_stats_traffic_download',
  traffic_upload: 'cloud_connect_stats_traffic_upload',
  error_download: 'cloud_connect_stats_error_download',
  error_upload: 'cloud_connect_stats_error_upload',
  light_in: 'cloud_connect_stats_light_in',
  light_out: 'cloud_connect_stats_light_out',
  down: 'down',
  up: 'up',
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
    legend: {
      position: 'bottom',
      display: true,
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
};

export default {
  PERIOD,
  PERIOD_ENUM,
  STATISTICS,
  TYPE,
  TYPE_ENUM,
  TYPE_LABELS,
};
