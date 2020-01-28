import template from './private-registry.html';
import controller from './private-registry.controller';

export default {
  template,
  controller,
  bindings: {
    copyApiUrl: '<',
    createLink: '<',
    deleteRegistry: '<',
    generateCredentials: '<',
    getRegistryPlan: '<',
    guideUrl: '<',
    projectId: '<',
    refreshRegistryList: '<',
    registries: '<',
    updateRegistry: '<',
  },
};
