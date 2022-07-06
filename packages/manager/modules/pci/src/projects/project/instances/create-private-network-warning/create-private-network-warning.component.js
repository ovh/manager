import controller from './create-private-network-warning.controller';
import template from './create-private-network-warning.html';

export default {
  controller,
  template,
  bindings: {
    goBack: '<',
    goToPrivateNetworkConfigPage: '<',
  },
};
