import head from 'lodash/head';
import get from 'lodash/get';
import 'moment';

export default {
  chart: {
    options: {
      responsive: true,
      legend: {
        position: 'bottom',
        display: true,
      },
      elements: {
        point: {
          radius: 0,
        },
      },
      scales: {
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
    },
  },
  lastSeen: {
    limit: 5,
  },
};
