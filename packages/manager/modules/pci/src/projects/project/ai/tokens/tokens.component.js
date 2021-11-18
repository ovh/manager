import controller from './tokens.controller';
import template from './tokens.html';

export default {
  bindings: {
    tokens: '<',
    addToken: '<',
    bearerToken: '<',
    deleteToken: '<',
    updateToken: '<',
  },
  template,
  controller,
};
