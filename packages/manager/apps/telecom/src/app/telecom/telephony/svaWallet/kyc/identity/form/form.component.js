import template from './form.html';
import controller from './form.controller';

export default {
  template,
  controller,
  bindings: {
    companyKinds: '<',
    countryEnum: '<',
    saveWallet: '<',
  },
};
