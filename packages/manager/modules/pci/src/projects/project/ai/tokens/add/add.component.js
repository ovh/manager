import controller from './add.controller';
import template from './add.html';

export default {
  bindings: {
    goBack: '<',
    labelSelector: '<',
    projectId: '<',
    regions: '<',
  },
  template,
  controller,
};
