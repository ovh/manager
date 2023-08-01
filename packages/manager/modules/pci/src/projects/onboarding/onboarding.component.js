import controller from './onboarding.controller';
import template from './onboarding.html';

export default {
  bindings: {
    isTrustedZone: '<',
    goToCreateNewProject: '<',
    goToCreateDiscoveryProject: '<',
    cart: '<',
    isValidHdsSupportLevel: '<',
    hds: '<',
    model: '<',
    summary: '<',
    getSummary: '<',
    setCartProjectItem: '<',
  },
  controller,
  template,
};
