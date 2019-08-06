import controller from './add.controller';
import template from './add.html';

export default {
  bindings: {
    goBack: '<',
    projectId: '@',
    privateNetworks: '<',
    publicNetwork: '<',
    regions: '<',
    cancelLink: '<',
    prices: '<',
    quotaLink: '<',
  },
  controller,
  template,
};
