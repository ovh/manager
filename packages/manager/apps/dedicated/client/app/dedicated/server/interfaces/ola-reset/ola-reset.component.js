import controller from './ola-reset.controller';
import template from './ola-reset.html';

export default {
  bindings: {
    goBack: '<',
    alertError: '<',
    atTrack: '<',
    serverName: '<',
    trackingPrefix: '<',
    ola: '<',
  },
  controller,
  template,
};
