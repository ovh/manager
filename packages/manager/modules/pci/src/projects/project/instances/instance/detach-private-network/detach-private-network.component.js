import controller from './detach-private-network.controller';
import template from './detach-private-network.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    instance: '<',
    privateNetworks: '<',
    goBack: '<',
  },
};
