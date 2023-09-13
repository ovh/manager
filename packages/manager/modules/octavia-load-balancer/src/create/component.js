import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    projectId: '<',
    serviceName: '<',
    sizeFlavour: '<',
    regionsPlans: '<',
    trackingProductPage: '@',
    trackingRegionAvailability: '@',
  },
  controller,
  template,
};
