import controller from './local-zone.controller';
import template from './local-zone.html';

export default {
  controller,
  template,
  bindings: {
    createNetwork: '<',
    gotoDeleteSubnet: '<',
    trackClick: '<',
    localPrivateNetworks: '<',
    projectId: '<',
  },
};
