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
    goToAddUserContainer: '<',
    goToStorageContainers: '<',
    guideUrl: '<',
    projectId: '<',
    viewContainer: '<',
  },
};
