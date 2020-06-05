export default class {
  $onInit() {
    this.options = {
      responsive: true,
      elements: {
        line: {
          fill: false,
          tension: 0,
          borderWidth: 1,
        },
        point: {
          radius: 3,
        },
      },
      animation: {
        duration: 0,
      },
      tooltips: {
        mode: 'x-axis',
        callbacks: {
          label: (tooltipItem, data) => {
            let label = data.datasets[tooltipItem.datasetIndex].label || '';

            if (label) {
              label += `: ${tooltipItem.yLabel}`;
            }
            if (this.unit) {
              label += `${this.unit}`;
            }
            return label;
          },
        },
      },
      legend: {
        display: true,
      },
      scales: {
        yAxes: [
          {
            id: 'y-axis',
            type: 'linear',
            display: true,
            position: 'left',
            gridLines: {
              display: true,
              color: 'rgba(213,215,220,0.18)',
            },
            ticks: {
              display: true,
            },
            afterDataLimits: (axis) => {
              if (this.unit === '%') {
                axis.max = 100; // eslint-disable-line no-param-reassign
                axis.min = 0; // eslint-disable-line no-param-reassign
              } else {
                // add some margin to avoid chart crop
                axis.max += 1; // eslint-disable-line no-param-reassign
                axis.min = 0; // eslint-disable-line no-param-reassign
              }
            },
          },
        ],
        xAxes: [
          {
            id: 'x-axis',
            display: true,
            position: 'bottom',
          },
        ],
      },
    };
  }
}
