import controller from './add.controller';
import template from './add.html';

export default {
  bindings: {
    regions: '<',
    goBack: '<',
    projectId: '<',
    goToRegistries: '<',
    saveRegistry: '<',
  },
  template,
  controller,
};
