export const TRUNK_PACK_DETAILS = {
  chart: {
    type: 'bar',
    data: {
      datasets: [],
    },
    options: {
      responsive: true,
      animation: {
        duration: 0,
        onComplete({ chart }) {
          const dataOffset = 0.1;
          const chartInstance = chart;
          const { ctx } = chartInstance;

          ctx.textAlign = 'center';
          ctx.fillStyle = 'rgba(0, 0, 0, 1)';
          ctx.textBaseline = 'bottom';

          this.data.datasets.forEach((dataset, i) => {
            const meta = chartInstance.getDatasetMeta(i);
            const portraitFormat = window.innerHeight > window.innerWidth;
            meta.data.forEach((bar, index) => {
              const data = dataset.data[index] - dataOffset;
              const label = portraitFormat
                ? data
                : data + (data > 1 ? ' packs' : ' pack');
              ctx.fillText(label, bar.x, bar.y - 5);
            });
          });
        },
      },
      events: [],
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
        },
        tooltip: {
          enabled: false,
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
          type: 'category',
        },

        y: {
          display: false,
          position: 'left',
          ticks: {
            beginAtZero: true,
            max: 2.3,
          },
        },
      },
    },
  },
};

export default {
  TRUNK_PACK_DETAILS,
};
