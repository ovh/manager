import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    clusters: '<',
    getClusterDetailsState: '<',
    nodeDetails: '<',
    serviceName: '<',
  },
  controller,
  template,
};
