import template from './query-statistics.html';
import controller from './query-statistics.controller';

export default {
  bindings: {
    projectId: '<',
    databaseId: '<',
    database: '<',
    trackDashboard: '<',
    queryStatistics: '<',
    goBackToQueryStatistics: '<',
    paginationNumber: '<',
    paginationSize: '<',
    onListParamsChange: '<',
  },
  controller,
  template,
};
