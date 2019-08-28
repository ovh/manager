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
    goToStorageContainers: '<',
    guideUrl: '<',
    projectId: '<',
    viewContainer: '<',
  },
};
