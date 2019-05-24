import template from './ticket.html';

export default {
  bindings: {
    goToTickets: '<',
    isMessageFromCustomer: '<?',
    messages: '<',
    ticket: '<',
    tickets: '<?',
    translateTicketSender: '<',
    translateTicketState: '<',
  },
  name: 'supportTicket',
  template,
};
