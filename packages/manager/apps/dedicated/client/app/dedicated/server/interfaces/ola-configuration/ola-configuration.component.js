import controller from './ola-configuration.controller';
import template from './ola-configuration.html';

export default {
  bindings: {
    goBack: '<',
    atTrack: '<',
    serverName: '<',
    specifications: '<',
    interfaces: '<',
    ola: '<',
    urls: '<',
    taskPolling: '<',
  },
  controller,
  template,
};
