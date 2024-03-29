import controller from './delete.controller';
import template from './delete.html';

export default {
  controller,
  template,
  bindings: {
    archive: '<',
    container: '<',
    containerId: '<',
    goBack: '<',
    isHighPerfStorage: '<',
    projectId: '<',
    trackingPrefix: '<',
  },
};
