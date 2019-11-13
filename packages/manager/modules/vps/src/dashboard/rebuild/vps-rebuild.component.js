import controller from './vps-rebuild.controller';
import template from './vps-rebuild.html';

export default {
  bindings: {
    availableImages: '<',
    displayError: '<',
    displaySuccess: '<',
    goBackToDashboard: '<',
    serviceName: '<',
    sshKeys: '<',
  },
  controller,
  name: 'ovhManagerVpsRebuild',
  template,
};
