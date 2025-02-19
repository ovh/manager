import controller from './byoip.controller';
import template from './byoip.html';

export default {
  bindings: {
    plan: '<',
    guideUrl: '<',
    getToken: '<',
    goToDisclaimer: '<',
    goBack: '<',
    isBannerByoipAvailable: '<',
  },
  name: 'ipByoipComponent',
  controller,
  template,
};
