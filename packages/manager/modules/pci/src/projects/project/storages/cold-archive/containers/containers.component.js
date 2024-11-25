import controller from './containers.controller';
import template from './containers.html';

export default {
  controller,
  template,
  bindings: {
    containers: '<',
    containerName: '<',
    createdContainerInfos: '<',
    refreshContainers: '<',
    initGuides: '<',
    guides: '<',
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
    goBack: '<',
    trackClick: '<',
    trackPage: '<',
    regions: '<',
    goToEditRetentionContainer: '<',
  },
};
