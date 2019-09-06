import controller from './ticket.controller';
import template from './ticket.html';

export default {
  bindings: {
    goBack: '<',
    reload: '<',
    ticket: '<',
  },
  controller,
  name: 'supportTicket',
  template,
};
