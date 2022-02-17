import template from './overview-identity-edit.html';
import controller from './overview-identity-edit.controller';

export default {
  template,
  controller,
  bindings: {
    svaWallet: '<',
    companyKinds: '<',
    countryEnum: '<',
    putWallet: '<',
    editMode: '=',
  },
};
