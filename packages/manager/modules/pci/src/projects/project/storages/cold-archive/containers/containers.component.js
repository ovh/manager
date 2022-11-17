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
    goToDeleteContainer: '<',
    goToArchiveContainer: '<',
    scrollToTop: '<',
    guides: '<',
    goBack: '<',
    trackClick: '<',
    trackPage: '<',
  },
};
