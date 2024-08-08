import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    serviceName: '<',
    availableOffers: '<',
    goBack: '<',
  },
  controller,
  template,
};
