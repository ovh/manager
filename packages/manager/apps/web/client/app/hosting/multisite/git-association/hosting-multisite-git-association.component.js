import controller from './hosting-multisite-git-association.controller';
import template from './hosting-multisite-git-association.html';

export default {
  bindings: {
    sshKey: '<',
    path: '<',
    status: '<',
    alertId: '<',
    serviceName: '<',
    goBack: '<',
    webHookUrl: '<',
  },
  controller,
  template,
};
