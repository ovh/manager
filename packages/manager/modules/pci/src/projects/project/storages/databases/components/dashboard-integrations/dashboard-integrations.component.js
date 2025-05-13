import controller from './dashboard-integrations.controller';
import template from './dashboard-integrations.html';

export default {
  bindings: {
    integrations: '<',
    onManageButtonClick: '&?',
    disabled: '<',
  },
  controller,
  template,
};
