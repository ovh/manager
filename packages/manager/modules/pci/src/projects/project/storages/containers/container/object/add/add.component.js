import controller from './add.controller';
import template from './add.html';

export default {
  controller,
  template,
  bindings: {
    archive: '<',
    projectId: '<',
    containerId: '<',
    container: '<',
    goBack: '<',
  },
};
