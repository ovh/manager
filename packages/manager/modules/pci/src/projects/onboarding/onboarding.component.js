import controller from './onboarding.controller';
import template from './onboarding.html';

export default {
  bindings: {
    isTrustedZone: '<',
    openTrustedZoneCallbackPage: '<',
  },
  controller,
  template,
};
