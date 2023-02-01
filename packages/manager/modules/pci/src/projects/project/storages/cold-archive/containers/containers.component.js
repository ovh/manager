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
    goToManageContainer: '<',
    goToAddUserToContainer: '<',
    goToDeleteContainerObjects: '<',
    goToDeleteContainer: '<',
    goToFlushArchive: '<',
    goToDeleteArchive: '<',
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
