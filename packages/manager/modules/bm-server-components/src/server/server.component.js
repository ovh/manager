import controller from './server.controller';
import template from './server.html';

export default {
  bindings: {
    statePrefix: '<',
    currentActiveLink: '<',
    features: '<',
    ola: '<',
    server: '<',
    serviceInfos: '<',
    specifications: '<',
    user: '<',
    worldPart: '<',
    nutanixCluster: '<',
    backupStorageAvailable: '<',
  },
  controller,
  template,
};
