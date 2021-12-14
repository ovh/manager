import controller from './account-add.controller';
import template from './account-add.html';

export default {
  bindings: {
    countries: '<',
    phoneCountries: '<',
    goToAccounts: '<',
  },
  controller,
  template,
};
