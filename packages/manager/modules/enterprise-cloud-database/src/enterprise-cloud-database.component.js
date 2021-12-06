import template from './enterprise-cloud-database.html';
import controller from './enterprise-cloud-database.controller';

export default {
  bindings: {
    capabilities: '<',
    clusters: '<',
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
