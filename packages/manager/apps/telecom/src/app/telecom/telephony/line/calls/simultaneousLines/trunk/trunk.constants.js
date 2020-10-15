export const TRUNK_PACK_DETAILS = {
  chart: {
    type: 'bar',
    options: {
      animation: {
        duration: 0,
        onComplete() {
          const dataOffset = 0.1;
          const chartInstance = this.chart;
          const { ctx } = chartInstance;

          ctx.textAlign = 'center';
          ctx.fillStyle = 'rgba(0, 0, 0, 1)';
          ctx.textBaseline = 'bottom';

          this.data.datasets.forEach((dataset, i) => {
            const meta = chartInstance.controller.getDatasetMeta(i);
            const portraitFormat = window.innerHeight > window.innerWidth;
            meta.data.forEach((bar, index) => {
              const data = dataset.data[index] - dataOffset;
              const label = portraitFormat
                ? data
                : data + (data > 1 ? ' packs' : ' pack');
              ctx.fillText(label, bar._model.x, bar._model.y - 5);
            });
          });
        },
      },
      events: [],
      legend: {
        display: true,
        position: 'bottom',
      },
      responsive: true,
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
            type: 'category',
          },
        ],
        yAxes: [
          {
            display: false,
            position: 'left',
            ticks: {
              beginAtZero: true,
              max: 2.3,
            },
          },
        ],
      },
      tooltips: {
        enabled: false,
      },
    },
  },
};

export default {
  TRUNK_PACK_DETAILS,
};
