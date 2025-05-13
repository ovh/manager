import controller from './account.controller';
import template from './account.html';

export default {
  bindings: {
    productId: '<',
    organization: '<',
    securityLink: '<',
    countries: '<',
    phoneCountries: '<',
    goToAddAccount: '<',
    goToUpdateAccount: '<',
    goToAliasManagement: '<',
  },
  controller,
  template,
};
