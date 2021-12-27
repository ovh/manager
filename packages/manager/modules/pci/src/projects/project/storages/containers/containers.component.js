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
    goToAddUserContainer: '<',
    goToStorageContainers: '<',
    guideUrl: '<',
    onListParamChange: '<',
    projectId: '<',
    viewContainer: '<',
    getStateName: '<',
    steins: '<',
    customerRegions: '<',
    containersRegions: '<',
    goToRegion: '<',
  },
};
