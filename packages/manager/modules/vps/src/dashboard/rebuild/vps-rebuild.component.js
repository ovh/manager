import controller from './vps-rebuild.controller';
import template from './vps-rebuild.html';

export default {
  bindings: {
    availableImages: '<',
    displayError: '<',
    displaySuccess: '<',
    goBack: '<',
    serviceName: '<',
  },
  controller,
  name: 'ovhManagerVpsRebuild',
  template,
};
