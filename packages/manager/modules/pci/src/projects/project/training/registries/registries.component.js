import controller from './registries.controller';
import template from './registries.html';

export default {
  controller,
  template,
  bindings: {
    regions: '<',
    refreshState: '<',
    goToRegistryAdd: '<',
    goToRegistryDelete: '<',
    registryList: '<',
  },
};
