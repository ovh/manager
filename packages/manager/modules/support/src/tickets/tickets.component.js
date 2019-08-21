import controller from './tickets.controller';
import template from './tickets.html';

export default {
  bindings: {
    goToTicket: '<',
    gridColumnLastMessageFromTypeOptions: '<',
    gridColumnStateTypeOptions: '<',
    reload: '<',
    tickets: '<',
  },
  controller,
  name: 'supportTickets',
  template,
};
