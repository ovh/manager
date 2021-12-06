import controller from './tickets.controller';
import template from './tickets.html';

export default {
  bindings: {
    archived: '<',
    filters: '<',
    goToTicket: '<',
    goToTicketCreation: '<',
    gridColumnLastMessageFromTypeOptions: '<',
    gridColumnStateTypeOptions: '<',
    onGridParamsChange: '<',
    pageNumber: '<',
    pageSize: '<',
    reload: '<',
    sortBy: '<',
    sortOrder: '<',
    tickets: '<',
  },
  controller,
  name: 'supportTickets',
  template,
};
