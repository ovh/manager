export const TELEPHONY_ALIAS_CONSUMPTION = {
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
      },
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        },
      },
      scales: {
        x: {
          display: true,
          grid: {
            offsetGridLines: true,
            display: false,
          },
          position: 'bottom',
          ticks: {
            mirror: true,
          },
          time: {
            displayFormats: {
              day: 'MMM D',
            },
          },
          type: 'time',
        },

        y: {
          display: true,
          position: 'left',
          beginAtZero: true,
          title: {
            display: true,
          },
          grid: {
            display: true,
          },
        },
      },
    },
  },
};

export default {
  TELEPHONY_ALIAS_CONSUMPTION,
};
