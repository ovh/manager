import controller from './tokens.controller';
import template from './tokens.html';

export default {
  bindings: {
    jwtToken: '<',
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
