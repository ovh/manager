import template from './analytics-data-platform.html';
import controller from './analytics-data-platform.controller';

export default {
  template,
  controller,
  bindings: {
    projectId: '<',
    manageCluster: '<',
    deployCluster: '<',
    clusters: '<',
  },
};
