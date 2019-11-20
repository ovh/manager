import controller from './detach.controller';
import template from './detach.html';

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
