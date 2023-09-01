import controller from './otrs.controller';
import template from './otrs.html';

export default {
  bindings: {
    archived: '<',
    filters: '<',
    goToTicket: '<',
    gridColumnLastMessageFromTypeOptions: '<',
    gridColumnStateTypeOptions: '<',
    onGridParamsChange: '<',
    pageNumber: '<',
    pageSize: '<',
    reload: '<',
    sortBy: '<',
    sortOrder: '<',
    tickets: '<',
    totalTickets: '<',
    triggerTicketCreation: '<',
  },
  controller,
  template,
};
