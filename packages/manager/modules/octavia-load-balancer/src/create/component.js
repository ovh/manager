import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    projectId: '<',
    serviceName: '<',
    sizeFlavour: '<',
    catalogGateway: '<',
    regionsPlansGroupBySize: '<',
    trackingProductPage: '@',
    trackingRegionAvailability: '@',
    trackingPrivateNetworkCreation: '@',
    privateNetworkCreationLink: '<',
  },
  controller,
  template,
};
