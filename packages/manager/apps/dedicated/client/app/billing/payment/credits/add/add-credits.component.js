import controller from './add-credits.controller';
import template from './add-credits.html';

export default {
  bindings: {
    addCreditCode: '<',
    goBack: '<',
  },
  controller,
  template,
};
