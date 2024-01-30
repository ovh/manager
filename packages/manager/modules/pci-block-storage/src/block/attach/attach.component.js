import controller from './attach.controller';
import template from './attach.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    storageId: '<',
    storage: '<',
    instances: '<',
    goBack: '<',
  },
};
