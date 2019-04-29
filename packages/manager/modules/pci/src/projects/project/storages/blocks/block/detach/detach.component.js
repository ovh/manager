import controller from './detach.controller';
import template from './detach.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    storageId: '<',
    storage: '<',
    goBack: '<',
  },
};
