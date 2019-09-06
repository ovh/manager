import controller from './tickets.controller';
import template from './tickets.html';

export default {
  bindings: {
    cleanCache: '<',
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
    totalNumberOfItems: '<',
  },
  controller,
  name: 'supportTickets',
  template,
};
