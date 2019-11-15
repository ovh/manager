import controller from './telephony.controller';
import template from './telephony.html';

export default {
  controller,
  template,
  bindings: {
    filter: '<',
    resources: '<',
    serverStateEnum: '<',
    datacenterEnum: '<',
    onListParamsChange: '<',
    paginationNumber: '<',
    paginationSize: '<',
    paginationTotalCount: '<',
    sort: '<',
    sortOrder: '<',
    getBillingAccountLink: '<',
  },
};
