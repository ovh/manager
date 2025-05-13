import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    archived: '<',
    filters: '<',
    goToTicket: '<',
    openTicketCreationModal: '<',
    gridColumnLastMessageFromTypeOptions: '<',
    gridColumnStateTypeOptions: '<',
    onGridParamsChange: '<',
    pageNumber: '<',
    pageSize: '<',
    reload: '<',
    sortBy: '<',
    sortOrder: '<',
    tickets: '<',
    totalCount: '<',
    triggerTicketCreation: '<',
  },
  controller,
  name: 'supportTickets',
  template,
};
