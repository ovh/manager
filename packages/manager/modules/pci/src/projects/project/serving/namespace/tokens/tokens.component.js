import controller from './tokens.controller';
import template from './tokens.html';

const component = {
  bindings: {
    addToken: '<',
    deleteToken: '<',
    updateToken: '<',
    namespaceId: '<',
    tokens: '<',
    projectId: '<',
    project: '<',
  },
  template,
  controller,
};

export default component;
