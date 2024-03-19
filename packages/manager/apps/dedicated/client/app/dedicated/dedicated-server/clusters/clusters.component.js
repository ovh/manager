import template from './clusters.html';

import controller from './clusters.controller';

export default {
  bindings: {
    filter: '<',
    dedicatedClusters: '<',
    orderUrl: '<',
    onListParamsChange: '<',
    getClusterDashboardLink: '<',
    paginationNumber: '<',
    paginationSize: '<',
    paginationTotalCount: '<',
    sort: '<',
    sortOrder: '<',
    isMultiAZAvailable: '<',
  },
  controller,
  template,
};
