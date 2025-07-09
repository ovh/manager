import controller from './autorenew.controller';
import template from './autorenew.html';

export default {
  bindings: {
    agreementsLink: '<',
    currentActiveLink: '<',
    goToAutorenew: '<',
    homeLink: '<',
    isAutorenewManagementAvailable: '<',
    sshLink: '<',
    guides: '<',
    trackClick: '<',
  },
  controller,
  template,
};
