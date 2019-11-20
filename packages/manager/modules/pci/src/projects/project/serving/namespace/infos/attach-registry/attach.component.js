import controller from './attach.controller';
import template from './attach.html';

const component = {
  bindings: {
    goBack: '<',
    namespaceId: '<',
    projectId: '<',
  },
  template,
  controller,
};

export default component;
