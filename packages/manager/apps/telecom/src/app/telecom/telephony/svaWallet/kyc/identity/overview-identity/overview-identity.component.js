import template from './overview-identity.html';
import controller from './overview-identity.controller';

export default {
  template,
  controller,
  bindings: {
    svaWallet: '<',
    companyKinds: '<',
    countryEnum: '<',
    putWallet: '<',
  },
};
