import controller from './interfaces-rename.controller';
import template from './interfaces-rename.html';

export default {
  controller,
  template,
  bindings: {
    goBack: '<',
    interface: '<',
    serverName: '<',
  },
};
