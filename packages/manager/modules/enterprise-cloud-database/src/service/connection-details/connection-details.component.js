import controller from './connection-details.controller';
import template from './connection-details.html';

export default {
  template,
  controller,
  bindings: {
    clusterDetails: '<',
    clusterType: '<',
    endPoints: '<',
  },
};
