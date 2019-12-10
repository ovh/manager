import controller from './add.controller';
import template from './add.html';

export default {
  bindings: {
    goBack: '<',
    namespaceId: '<',
    resource: '<',
    projectId: '<',
  },
  template,
  controller,
};
