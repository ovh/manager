import controller from './add.controller';
import template from './add.html';

export default {
  bindings: {
    pciFeatures: '<',
    isTrustedZone: '<',
    excludeCategories: '<',
    backup: '<',
    goBack: '<',
    publicNetwork: '<',
    privateNetworks: '<',
    projectId: '<',
    quota: '<',
    quotaLink: '<',
  },
  controller,
  template,
};
