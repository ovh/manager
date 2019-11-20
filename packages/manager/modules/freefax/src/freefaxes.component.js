import controller from './freefaxes.controller';
import template from './freefaxes.html';

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

    getFreefaxLink: '<',
  },
  controller,
  template,
};
