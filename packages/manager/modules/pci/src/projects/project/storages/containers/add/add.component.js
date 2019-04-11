import controller from './add.controller';
import template from './add.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    archive: '<',
    goBack: '<',
    cancelLink: '<',
  },
};
