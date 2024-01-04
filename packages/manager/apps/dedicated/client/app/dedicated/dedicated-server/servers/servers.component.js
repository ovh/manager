import controller from './servers.controller';
import template from './servers.html';

export default {
  bindings: {
    filter: '<',
    dedicatedServers: '<',
    isOrderAvailable: '<',
    isEcoRangeOrderAvailable: '<',
    isAutorenew2016DeploymentBannerAvailable: '<',
    displayRbx1EolBanner: '<',
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
