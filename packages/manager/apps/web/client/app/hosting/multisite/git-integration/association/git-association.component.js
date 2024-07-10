import controller from './git-association.controller';
import template from './git-association.html';

export default {
  bindings: {
    sshKey: '<',
    path: '<',
    serviceName: '<',
    goBack: '<',
    isConfiguration: '<',
    webHookUrl: '<',
  },
  controller,
  template,
};
