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
    goToAddUserContainer: '<',
    archiveContainer: '<',
    restoreContainer: '<',
    goToDeleteContainer: '<',
    scrollToTop: '<',
    guides: '<',
    goBack: '<',
    trackClick: '<',
    trackPage: '<',
  },
};
