import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    cluster: '<',
    clusterAddOns: '<',
    goToEditName: '<',
    goToUpgradePrivateBandwidth: '<',
    server: '<',
    serviceDetails: '<',
    serviceInfo: '<',
    serviceName: '<',
    trackingPrefix: '<',
    user: '<',
    handleError: '<',
  },
  controller,
  template,
};
