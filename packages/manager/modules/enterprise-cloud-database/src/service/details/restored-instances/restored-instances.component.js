import template from './restored-instances.html';
import controller from './restored-instances.controller';

export default {
  bindings: {
    clusterId: '<',
    clusterDetails: '<',
    endpoints: '<',
    goToDelete: '<',
    refreshRestoredInstances: '<',
    restoredInstances: '<',
  },
  controller,
  template,
};
