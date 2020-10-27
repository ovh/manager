export const TELEPHONY_ALIAS_CONSUMPTION = {
  chart: {
    type: 'line',
    data: {
      datasets: [],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      legend: {
        display: true,
        position: 'bottom',
      },
      element: {
        point: {
          radius: 0,
        },
      },
      tooltips: {
        mode: 'label',
        position: 'nearest',
      },
      scales: {
        xAxes: [
          {
            display: true,
            gridLines: {
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
        ],
        yAxes: [
          {
            display: true,
            position: 'left',
            ticks: {
              beginAtZero: true,
            },
            scaleLabel: {
              display: true,
            },
            gridLines: {
              display: true,
            },
          },
        ],
      },
    },
  },
};

export default {
  TELEPHONY_ALIAS_CONSUMPTION,
};
