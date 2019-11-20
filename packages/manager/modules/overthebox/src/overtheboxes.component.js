import controller from './overtheboxes.controller';
import template from './overtheboxes.html';

export default {
  bindings: {
    filter: '<',
    resources: '<',
    onListParamsChange: '<',
    paginationNumber: '<',
    paginationSize: '<',
    paginationTotalCount: '<',
    sort: '<',
    sortOrder: '<',

    getOvertheboxLink: '<',
  },
  controller,
  template,
};
