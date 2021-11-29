import template from './analytics-data-platform.html';
import controller from './analytics-data-platform.controller';

export default {
  template,
  controller,
  bindings: {
    pciFeatureRedirect: '<',
    clusters: '<',
    guideUrl: '<',
    manageCluster: '<',
    projectId: '<',
    clusterId: '<',
    steins: '<',
    customerRegions: '<',
    clustersRegions: '<',
    onListParamChange: '<',
  },
};
