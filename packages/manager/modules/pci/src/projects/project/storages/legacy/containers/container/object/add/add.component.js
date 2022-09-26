import controller from './add.controller';
import template from './add.html';

export default {
  controller,
  template,
  bindings: {
    archive: '<',
    container: '<',
    containerId: '<',
    goBack: '<',
    projectId: '<',
    trackingPrefix: '<',
  },
};
