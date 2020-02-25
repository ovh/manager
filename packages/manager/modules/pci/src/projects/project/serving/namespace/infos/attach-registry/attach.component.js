import controller from './attach.controller';
import template from './attach.html';

export default {
  bindings: {
    goBack: '<',
    namespaceId: '<',
    projectId: '<',
  },
  template,
  controller,
};
