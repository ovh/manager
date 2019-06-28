import controller from './resources.controller';
import template from './resources.html';

export default {
  bindings: {
    selectedResource: '=?',
    instances: '<',
    projectId: '<',
    selectedInstance: '<',
    goToInstancePage: '<',
    isEditMode: '<',
  },
  controller,
  template,
};
