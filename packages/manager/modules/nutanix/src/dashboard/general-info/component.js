import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    cluster: '<',
    clusterAddOns: '<',
    goToEditName: '<',
    goToUpgradePrivateBandwidth: '<',
    goToRedeploy: '<',
    server: '<',
    serviceDetails: '<',
    serviceInfo: '<',
    serviceName: '<',
    trackingPrefix: '<',
    user: '<',
    handleError: '<',
    nutanixPlans: '<',
    getTechnicalDetails: '<',
    isOldCluster: '<',
  },
  controller,
  template,
};
