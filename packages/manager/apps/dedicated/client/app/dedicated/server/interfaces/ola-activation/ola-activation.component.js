import controller from './ola-activation.controller';
import template from './ola-activation.html';

export default {
  bindings: {
    goBack: '<',
    alertError: '<',
    atTrack: '<',
    server: '<',
    serverName: '<',
    trackingPrefix: '<',
    user: '<',
  },
  controller,
  template,
};
