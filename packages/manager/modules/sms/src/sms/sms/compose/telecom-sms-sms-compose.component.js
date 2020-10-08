import controller from './telecom-sms-sms-compose.controller';
import template from './telecom-sms-sms-compose.html';

export const component = {
  controller,
  template,
  bindings: {
    getOrderHref: '<',
    sendersLink: '<',
  },
};

export const name = 'smsCompose';

export default {
  component,
  name,
};
