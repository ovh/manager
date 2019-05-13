import controller from './add.controller';
import template from './add.html';

export default {
  bindings: {
    goBack: '<',
    projectId: '<',
    regions: '<',
    versions: '<',
  },
  controller,
  template,
};
