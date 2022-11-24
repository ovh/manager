import controller from './containers.controller';
import template from './containers.html';

export default {
  controller,
  template,
  bindings: {
    containers: '<',
    containerName: '<',
    refreshContainers: '<',
    goToAddColdArchive: '<',
    goToAddUserToContainer: '<',
    goToDeleteContainer: '<',
    goToDeleteContainerObjects: '<',
    goToArchiveContainer: '<',
    goToRestoreContainer: '<',
    goToContainer: '<',
    scrollToTop: '<',
    guides: '<',
    goBack: '<',
    trackClick: '<',
    trackPage: '<',
  },
};
