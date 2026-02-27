import template from './template.html';
import controller from './controller';

export default {
  bindings: {
    replicationsAvaibleServices: '<',
    hasAvailableReplicationsServices: '<',
    goToOrder: '<',
    goToVolumes: '<',
    postReplications: '<',
    isNetworkAvailable: '<',
  },
  template,
  controller,
};
