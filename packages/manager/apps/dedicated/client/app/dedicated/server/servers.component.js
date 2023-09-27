import controller from './servers.controller';
import template from './servers.html';

export default {
  bindings: {
    filter: '<',
    dedicatedServers: '<',
    isOrderAvailable: '<',
    isEcoRangeOrderAvailable: '<',
    isAutorenew2016DeploymentBannerAvailable: '<',
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
