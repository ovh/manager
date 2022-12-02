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
    goToDeleteContainerObjects: '<',
    goToDeleteContainer: '<',
    goToDeleteArchive: '<',
    goToArchiveContainer: '<',
    goToRestoreContainer: '<',
    goToContainerVirtualHost: '<',
    goToContainer: '<',
    scrollToTop: '<',
    guides: '<',
    goBack: '<',
    trackClick: '<',
    trackPage: '<',
  },
};
