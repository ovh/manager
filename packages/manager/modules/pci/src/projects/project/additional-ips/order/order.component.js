import controller from './order.controller';
import template from './add.html';

export default {
  controller,
  template,
  bindings: {
    additionalIpInstances: '<',
    createInstanceUrl: '<',
    defaults: '<',
    floatingIpInstances: '<',
    goBack: '<',
    projectId: '<',
    publicCloudCatalog: '<',
    ipFailoverFormattedCatalog: '<',
    trackClick: '<',
    isDiscoveryProject: '<',
    goToDiscoveryProjectActivationPage: '&',
  },
};
