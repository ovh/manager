import controller from './user-agreements.controller';
import template from './user-agreements.html';

export default {
  bindings: {
    gotoAcceptAgreements: '<',
    onQueryParamsChange: '<',
    page: '<',
    itemsPerPage: '<',
    state: '<',
    sorting: '<',
  },
  controller,
  template,
};
