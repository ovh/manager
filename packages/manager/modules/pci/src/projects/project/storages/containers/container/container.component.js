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
    defaultPassword: '<?',
    deleteObject: '<',
    guideUrl: '<',
    projectId: '<',
    refresh: '<',
    defaultCriteria: '<?',
  },
};
