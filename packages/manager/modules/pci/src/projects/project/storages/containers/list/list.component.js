import controller from './list.controller';
import template from './list.html';

export default {
  controller,
  template,
  bindings: {
    addContainer: '<',
    archive: '<',
    containerLink: '<',
    containers: '<',
    deleteContainer: '<',
    goToStorageContainers: '<',
    projectId: '<',
    viewContainer: '<',
  },
};
