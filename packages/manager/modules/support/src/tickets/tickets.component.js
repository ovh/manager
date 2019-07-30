import template from './tickets.html';

export default {
  bindings: {
    goToTicket: '<',
    gridColumnLastMessageFromTypeOptions: '<',
    gridColumnStateTypeOptions: '<',
    tickets: '<',
  },
  name: 'tickets',
  template,
};
