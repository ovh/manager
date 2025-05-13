import controller from './telecom-sms-sms-compose.controller';
import template from './telecom-sms-sms-compose.html';

export const component = {
  controller,
  template,
  bindings: {
    goToOrder: '<',
    sendersLink: '<',
    trackClick: '<',
  },
};

export const name = 'smsCompose';

export default {
  component,
  name,
};
