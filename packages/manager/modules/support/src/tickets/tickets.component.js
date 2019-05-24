import template from './tickets.html';

export default {
  bindings: {
    goToTicket: '<',
    gridColumnLastMessageFromTypeOptions: '<',
    gridColumnStateTypeOptions: '<',
    tickets: '<?',
    translateTicketSender: '<',
    translateTicketState: '<',
  },
  name: 'tickets',
  template,
};
