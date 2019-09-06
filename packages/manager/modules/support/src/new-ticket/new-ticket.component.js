import controller from './new-ticket.controller';
import template from './new-ticket.html';

export default {
  bindings: {
    goToTickets: '&',
  },
  controller,
  name: 'supportNew',
  template,
};
