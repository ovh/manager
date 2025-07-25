import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    serviceName: '<',
    nodeId: '<',
    server: '<',
    isTerminated: '<',
    user: '<',
    bandwidthInformations: '<',
    serviceInfos: '<',
    specifications: '<',
    technicalDetails: '<',
    trackingPrefix: '<',
    goToNodeNameEdit: '<',
    goToNetboot: '<',
    goToNutanixNode: '<',
    goToReboot: '<',
    isOldCluster: '<',
    orderPrivateBandwidthLink: '<',
    hidePublicBandwidth: '<',
    commercialRange: '<',
  },
  controller,
  template,
};
