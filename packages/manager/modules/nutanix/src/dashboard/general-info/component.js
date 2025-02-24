import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    cluster: '<',
    clusterAddOns: '<',
    goToEditName: '<',
    goToUpgradePrivateBandwidth: '<',
    goToRedeploy: '<',
    goToAddNode: '<',
    server: '<',
    serviceDetails: '<',
    serviceInfo: '<',
    serviceName: '<',
    trackingPrefix: '<',
    user: '<',
    handleError: '<',
    clusterTechnicalDetails: '<',
    packType: '<',
    isLegacyPack: '<',
    technicalDetails: '<',
    isOldCluster: '<',
    isPackTypeAvailable: '<',
    nodes: '<',
    getAccountAuthorizations: '<',
    nutanixClusterIamName: '@',
    accountAuthorizations: '<',
    goToResiliate: '<',
    listingNodesPagesLink: '<',
  },
  controller,
  template,
};
