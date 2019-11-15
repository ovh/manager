import controller from './services.controller';
import template from './services.html';

export default {
  controller,
  template,
  bindings: {
    filter: '<',
    resources: '<',
    orderUrl: '<',
    serverStateEnum: '<',
    datacenterEnum: '<',
    onListParamsChange: '<',
    paginationNumber: '<',
    paginationSize: '<',
    paginationTotalCount: '<',
    sort: '<',
    sortOrder: '<',

    getServerDashboardLink: '<',
  },
};
