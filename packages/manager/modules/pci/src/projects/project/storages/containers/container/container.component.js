import controller from './container.controller';
import template from './container.html';

export default {
  controller,
  template,
  bindings: {
    addObject: '<',
    archive: '<',
    container: '<',
    containerId: '<',
    defaultCriteria: '<?',
    defaultPassword: '<?',
    deleteObject: '<',
    goToAddUserOnObject: '<',
    guideUrl: '<',
    projectId: '<',
    refresh: '<',
    trackingPrefix: '<',
  },
};
