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
    containerId: '<',
    deleteContainer: '<',
    goToStorageContainers: '<',
    guideUrl: '<',
    onListParamChange: '<',
    projectId: '<',
    viewContainer: '<',
    getStateName: '<',
    goToRegion: '<',
  },
};
