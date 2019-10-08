import template from './enterprise-cloud-database.html';
import controller from './enterprise-cloud-database.controller';

export default {
  bindings: {
    capabilities: '<',
    clusters: '<',
    createCluster: '<',
    getClusterDetails: '<',
    goToMyServices: '<',
    gettingStarted: '<',
    manageCluster: '<',
    refreshClusterList: '<',
    user: '<',
  },
  controller,
  template,
};
