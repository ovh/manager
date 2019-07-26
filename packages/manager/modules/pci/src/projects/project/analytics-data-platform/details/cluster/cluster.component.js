import template from './cluster.html';
import controller from './cluster.controller';

export default {
  template,
  controller,
  bindings: {
    projectId: '<',
    serviceName: '<',
    platformDetails: '<',
    publicCloudDetails: '<',
    clusterNodes: '<',
    flavors: '<',
  },
};
