export default {
  chart: {
    type: 'line',
    data: {
      datasets: [],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
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
        point: {
          radius: 0,
        },
      },
      scales: {
        y: {
          display: true,
          linear: true,
          position: 'left',
          title: {
            display: true,
          },
          grid: {
            drawBorder: true,
            display: true,
          },
          min: 0,
          ticks: {
            stepSize: 1,
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
