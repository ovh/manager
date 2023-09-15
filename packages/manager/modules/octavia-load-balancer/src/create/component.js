import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    serviceName: '<',
    sizeFlavour: '<',
    trackingProductPage: '@',
  },
  controller,
  template,
};
