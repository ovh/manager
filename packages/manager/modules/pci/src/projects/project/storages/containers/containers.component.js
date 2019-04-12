import controller from './containers.controller';
import template from './containers.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    addContainer: '<',
    viewContainer: '<',
    deleteContainer: '<',
    archive: '<',
  },
};
