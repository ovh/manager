import controller from './delete.controller';
import template from './delete.html';

export default {
  controller,
  template,
  bindings: {
    archive: '<',
    projectId: '<',
    containerId: '<',
    container: '<',
    goBack: '<',
    objectId: '<',
    object: '<',
    trackingPrefix: '<',
  },
};
