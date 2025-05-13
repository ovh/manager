import controller from './controller';
import template from './template.html';

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
