import controller from './user-agreements-details.controller';
import template from './user-agreements-details.html';

export default {
  bindings: {
    agreementId: '<',
    goBack: '<',
  },
  controller,
  template,
};
