import controller from './byoip.controller';
import template from './byoip.html';

export default {
  bindings: {
    plan: '<',
    getToken: '<',
    goToDisclaimer: '<',
    goBack: '<',
    isBannerByoipAvailable: '<',
  },
  name: 'ipByoipComponent',
  controller,
  template,
};
