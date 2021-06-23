import controller from './add.controller';
import template from './add.html';

export default {
  bindings: {
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
