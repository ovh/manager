import controller from './private-networks.controller';
import template from './private-networks.html';

export default {
  bindings: {
    createNetwork: '<',
    deleteNetwork: '<',
    guideUrl: '<',
    privateNetworks: '<',
    projectId: '<',
    networkId: '<',
    onListParamChange: '<',
  },
  controller,
  template,
};
