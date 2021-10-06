import get from 'lodash/get';
import head from 'lodash/head';

export const PACK_XDSL_STATISTICS = {
  chart: {
    type: 'line',
    data: {
      datasets: [],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        position: 'bottom',
        display: true,
      },
      elements: {
        point: {
          radius: 0,
        },
      },
      tooltips: {
        mode: 'label',
        intersect: false,
        callbacks: {
          title(data) {
            const timestamp = moment(get(head(data), 'xLabel'));
            return timestamp.fromNow();
          },
        },
      },
      scales: {
        yAxes: [
          {
            display: true,
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
  },
};

export const PREVIEW = 'preview';

export default {
  PACK_XDSL_STATISTICS,
  PREVIEW,
};
