import controller from './packs.controller';
import template from './packs.html';

export default {
  controller,
  template,
  bindings: {
    filter: '<',
    resources: '<',
    loadResource: '<',
    datacenterEnum: '<',
    onListParamsChange: '<',
    paginationNumber: '<',
    paginationSize: '<',
    paginationTotalCount: '<',
    sort: '<',
    sortOrder: '<',

    getPackLink: '<',
    getPackServicesLink: '<',
  },
};
