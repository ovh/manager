import controller from './private-cancel.controller';
import template from './private-cancel.html';

export default {
  controller,
  template,
  bindings: {
    goBack: '<',
    serverName: '<',
    user: '<',
  },
};
