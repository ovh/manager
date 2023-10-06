import controller from './registries.controller';
import template from './registries.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    userLink: '<',
    regions: '<',
    currentRegion: '<',
    registryList: '<',
    goToPrivateRegistry: '<',
    goToRegistryAdd: '<',
    goToRegistryDelete: '<',
  },
};
