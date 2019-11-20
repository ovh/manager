import controller from './add.controller';
import template from './add.html';

const component = {
  bindings: {
    goBack: '<',
    namespaceId: '<',
    resource: '<',
    projectId: '<',
  },
  template,
  controller,
};

export default component;
