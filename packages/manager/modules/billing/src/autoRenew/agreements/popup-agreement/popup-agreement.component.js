import controller from './popup-agreement.controller';
import template from './popup-agreement.html';

export default {
  bindings: {
    agreementId: '<',
    goBack: '<',
  },
  controller,
  template,
};
