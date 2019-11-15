import controller from './lines.controller';
import template from './lines.html';

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
