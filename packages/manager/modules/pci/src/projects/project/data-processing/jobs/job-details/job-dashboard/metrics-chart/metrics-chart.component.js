import controller from './metrics-chart.controller';
import template from './metrics-chart.html';

export default {
  template,
  controller,
  bindings: {
    data: '<',
    labels: '<',
    unit: '@',
  },
};
