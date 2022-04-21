import controller from './account-update.controller';
import template from './account-update.html';

export default {
  bindings: {
    emailAccount: '<',
    countries: '<',
    phoneCountries: '<',
    goBack: '<',
    goToAccounts: '<',
  },
  controller,
  template,
};
