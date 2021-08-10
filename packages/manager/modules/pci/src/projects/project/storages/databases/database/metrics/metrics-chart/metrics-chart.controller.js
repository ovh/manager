export default class {
  $onInit() {
    this.colors = ['rgba(2,182,219,1)'];
    this.datasetOverride = {
      xAxisId: 'x-axis',
      yAxisId: 'y-axis',
      pointRadius: 3,
      backgroundColor: 'rgba(237,248,253,0.5)',
      borderColor: 'rgba(2,182,219,1)',
      type: 'line',
      tension: 0,
    };
    this.options = {
      responsive: true,
      animation: {
        duration: 0,
      },
      tooltips: {
        mode: 'x-axis',
        callbacks: {
          label: (tooltipItem) => {
            let label = tooltipItem.yLabel;
            if (label && this.unit) {
              label += this.unit;
            }
            return label;
          },
        },
      },
      legend: {
        display: false,
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
              // add some margin to avoid chart crop
              axis.max += 1; // eslint-disable-line no-param-reassign
              axis.min = 0; // eslint-disable-line no-param-reassign
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
