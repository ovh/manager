import controller from './price-details.controller';
import template from './price-details.html';

export default {
  template,
  controller,
  bindings: {
    pricesData: '<',
    workerCount: '<',
    user: '<',
  },
};
