import controller from './form.controller';
import template from './form.html';

export default {
  bindings: {
    hasAgreed: '=',
    autorenewAgreements: '<',
    service: '=',
  },
  controller,
  template,
};
