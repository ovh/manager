import template from './template.html';
import controller from './controller';

export default /* @ngInject */ {
  controller,
  bindings: {
    legend: '<',
    large: '<',
    usage: '<',
    help: '<',
  },
  template,
};
