import controller from './container.controller';
import template from './container.html';

export default {
  controller,
  template,
  bindings: {
    archive: '<',
    projectId: '<',
    containerId: '<',
    goBack: '<',
    addObject: '<',
    deleteObject: '<',
  },
};
