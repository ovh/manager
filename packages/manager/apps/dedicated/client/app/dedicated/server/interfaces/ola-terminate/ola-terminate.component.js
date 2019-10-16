import controller from './ola-terminate.controller';
import template from './ola-terminate.html';

export default {
  bindings: {
    goBack: '<',
    alertError: '<',
    atTrack: '<',
    serverName: '<',
  },
  controller,
  template,
};
