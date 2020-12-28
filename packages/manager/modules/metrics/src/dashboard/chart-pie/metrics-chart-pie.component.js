import template from './metrics-chart-pie.html';
import controller from './metrics-chart-pie.controller';

export default {
  bindings: {
    color: '<',
    legend: '<',
    text: '<',
    textSmall: '<',
    value: '<',
  },
  controller,
  template,
};
