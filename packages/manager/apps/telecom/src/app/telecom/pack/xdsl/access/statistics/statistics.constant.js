export const PACK_XDSL_STATISTICS = {
  chart: {
    type: 'line',
    data: {
      datasets: [],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      elements: {
        line: {
          tension: 0.5,
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
        tooltip: {
          mode: 'index',
          intersect: false,
        },
      },
      scales: {
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

        x: {
          type: 'time',
          position: 'bottom',
          grid: {
            drawBorder: true,
            display: true,
          },
        },
      },
    },
  },
};

export const PREVIEW = 'preview';

export const PERIOD_LIST = {
  preview: 'preview',
  daily: 'daily',
  monthly: 'monthly',
  weekly: 'weekly',
  yearly: 'yearly',
};

export default {
  PACK_XDSL_STATISTICS,
  PREVIEW,
  PERIOD_LIST,
};
