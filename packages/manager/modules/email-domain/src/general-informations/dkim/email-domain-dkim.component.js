import controller from './email-domain-dkim.controller';
import template from './email-domain-dkim.html';

export default {
  bindings: {
    serviceName: '<',
    goBack: '<',
    dkim: '<',
  },
  controller,
  template,
};
