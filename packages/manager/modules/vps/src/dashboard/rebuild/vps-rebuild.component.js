import controller from './vps-rebuild.controller';
import template from './vps-rebuild.html';

export default {
  bindings: {
    availableImages: '<',
    displayError: '<',
    displaySuccess: '<',
    goBack: '<',
    serviceName: '<',
    sshKeys: '<',
    isRtmAvailable: '<',
    statistics: '<',
    vps: '<',
  },
  controller,
  name: 'ovhManagerVpsRebuild',
  template,
};
