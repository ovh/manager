import template from './private-registry.html';
import controller from './private-registry.controller';

export default {
  template,
  controller,
  bindings: {
    pciFeatureRedirect: '<',
    getRegistryDetails: '<',
    copyApiUrl: '<',
    createLink: '<',
    deleteRegistry: '<',
    generateCredentials: '<',
    getRegistryPlan: '<',
    guideUrl: '<',
    projectId: '<',
    onListParamChange: '<',
    refreshRegistryList: '<',
    registryId: '<',
    registries: '<',
    trackClick: '<',
    updateRegistry: '<',
    upgradePlan: '<',
  },
};
