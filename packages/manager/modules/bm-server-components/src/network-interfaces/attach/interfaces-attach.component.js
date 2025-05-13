import controller from './interfaces-attach.controller';
import template from './interfaces-attach.html';

export default {
  controller,
  template,
  bindings: {
    goBack: '<',
    alertError: '<',
    interface: '<',
    serverName: '<',
    vracks: '<',
  },
};
