import controller from './resources.controller';
import template from './resources.html';

export default {
  bindings: {
    goToInstancePage: '<',
    isEditMode: '<',
    instances: '<',
    projectId: '<',
    selectedInstance: '<',
    selectedResource: '=?',
  },
  controller,
  template,
};
