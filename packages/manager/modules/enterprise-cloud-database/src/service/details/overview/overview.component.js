import template from './overview.html';
import controller from './overview.controller';

export default {
  bindings: {
    clusterDetails: '<',
    clusterType: '<',
    clusterUser: '<',
    createCluster: '<',
    endPoints: '<',
    gettingStarted: '<',
    goToChangeName: '<',
    goToClusterSize: '<',
    goToMyServices: '<',
    goToClusterNodes: '<',
    goToSettings: '<',
    goToUpdatePassword: '<',
    hosts: '<',
    offerDetails: '<',
    serviceInfo: '<',
  },
  controller,
  template,
};
