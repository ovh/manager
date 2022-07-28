import controller from './otrs.controller';
import template from './otrs.html';

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
  template,
};
