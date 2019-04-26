import controller from './add.controller';
import template from './add.html';

export default {
  bindings: {
    goBack: '<',
    projectId: '@',
    privateNetworks: '<',
    regions: '<',
    cancelLink: '<',
  },
  controller,
  template,
};
