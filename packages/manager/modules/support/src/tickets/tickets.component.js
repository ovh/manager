import controller from './tickets.controller';
import template from './tickets.html';

export default {
  bindings: {
    goToTicket: '<',
    gridColumnLastMessageFromTypeOptions: '<',
    gridColumnStateTypeOptions: '<',
    tickets: '<',
  },
  controller,
  name: 'tickets',
  template,
};
