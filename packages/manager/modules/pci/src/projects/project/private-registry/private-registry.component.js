import template from './private-registry.html';
import controller from './private-registry.controller';

export default {
  template,
  controller,
  bindings: {
    getRegistryDetails: '<',
    guideUrl: '<',
    projectId: '<',
    registries: '<',
    updateRegistry: '<',
    upgradePlan: '<',
  },
};
