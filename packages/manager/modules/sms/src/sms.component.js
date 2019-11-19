import controller from './sms.controller';
import template from './sms.html';

export default {
  controller,
  template,
  bindings: {
    filter: '<',
    resources: '<',
    onListParamsChange: '<',
    paginationNumber: '<',
    paginationSize: '<',
    paginationTotalCount: '<',
    sort: '<',
    sortOrder: '<',

    getSmsLink: '<',
  },
};
