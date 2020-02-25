import controller from './add.controller';
import template from './add.html';

export default {
  bindings: {
    addInstanceSuccessMessage: '<',
    addInstancesSuccessMessage: '<',
    disablePrivateNetworks: '<',
    excludeCategories: '<?',
    goBack: '<',
    includeCategories: '<?',
    offer: '<',
    projectId: '@',
    privateNetworks: '<',
    publicNetwork: '<',
    regions: '<',
    cancelLink: '<',
    prices: '<',
    quotaLink: '<',
    selectedCategory: '@?',
  },
  controller,
  template,
};
