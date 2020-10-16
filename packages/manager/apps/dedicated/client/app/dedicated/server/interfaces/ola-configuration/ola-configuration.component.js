import controller from './ola-configuration.controller';
import template from './ola-configuration.html';

export default {
  bindings: {
    goBack: '<',
    guideUrl: '<',
    atTrack: '<',
    serverName: '<',
    specifications: '<',
    interfaces: '<',
    ola: '<',
  },
  controller,
  template,
};
