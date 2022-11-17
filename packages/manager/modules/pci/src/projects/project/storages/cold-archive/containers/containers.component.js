import controller from './containers.controller';
import template from './containers.html';

export default {
  controller,
  template,
  bindings: {
    containers: '<',
    refreshContainers: '<',
    goToAddColdArchive: '<',
    goToAddUserContainer: '<',
    archiveContainer: '<',
    restoreContainer: '<',
    deleteContainer: '<',
    scrollToTop: '<',
    guides: '<',
  },
};
