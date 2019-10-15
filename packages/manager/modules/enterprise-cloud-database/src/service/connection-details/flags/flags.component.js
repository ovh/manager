import controller from './flags.controller';
import template from './flags.html';

export default {
  template,
  controller,
  bindings: {
    command: '<',
    clusterType: '<',
    endPoint: '<',
  },
};
