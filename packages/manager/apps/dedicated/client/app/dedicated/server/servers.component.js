import controller from './servers.controller';
import template from './servers.html';

export default {
  bindings: {
    filter: '<',
    dedicatedServers: '<',
    isOrderAvailable: '<',
    isEcoRangeOrderAvailable: '<',
    orderUrl: '<',
    orderEcoRangeUrl: '<',
    serverStateEnum: '<',
    onListParamsChange: '<',
    getServerDashboardLink: '<',
    paginationNumber: '<',
    paginationSize: '<',
    paginationTotalCount: '<',
    sort: '<',
    sortOrder: '<',
  },
  controller,
  template,
};
