import controller from './add.controller';
import template from './add.html';

export default {
  bindings: {
    goBack: '<',
    resource: '<',
    projectId: '<',
    regions: '<',
  },
  template,
  controller,
};
