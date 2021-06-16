import controller from './containers.controller';
import template from './containers.html';

export default {
  controller,
  template,
  bindings: {
    addContainer: '<',
    archive: '<',
    containerLink: '<',
    containers: '<',
    deleteContainer: '<',
    addUserContainer: '<',
    goToStorageContainers: '<',
    guideUrl: '<',
    projectId: '<',
    viewContainer: '<',
  },
};
