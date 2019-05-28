import controller from './add.controller';
import template from './add.html';

export default {
  bindings: {
    backup: '<',
    goBack: '<',
    privateNetworks: '<',
    projectId: '<',
    quota: '<',
    quotaLink: '<',
  },
  controller,
  template,
};
