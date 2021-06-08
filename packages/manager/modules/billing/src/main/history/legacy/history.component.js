import controller from './billing-main-history.controller';
import template from './billing-main-history.html';

export default {
  bindings: {
    currentUser: '<',
    filters: '<',
    onListParamsChange: '<',
  },
  controller,
  template,
};
