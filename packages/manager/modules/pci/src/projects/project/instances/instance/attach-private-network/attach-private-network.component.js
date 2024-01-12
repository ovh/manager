import controller from './attach-private-network.controller';
import template from './attach-private-network.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    instance: '<',
    privateNetworks: '<',
    goBack: '<',
    localPrivateNetworks: '<',
    customerRegions: '<',
  },
};
