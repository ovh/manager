import controller from './telecom-sms-sms-outgoing.controller';
import template from './telecom-sms-sms-outgoing.html';

export default {
  controller,
  template,
  bindings: {
    getOutgoingSms: '<',
  },
};
