import controller from './new-account-form-controller';
import template from './new-account-form-component.html';

export default {
  bindings: {
    action: '@',
    model: '<',
    readonly: '<',
    onSubmit: '&', // on create callback
    userAccountServiceInfos: '<',
    fieldToFocus: '<',
    kycStatus: '<',
    getKycStatus: '<',
  },
  template,
  controller,
};
