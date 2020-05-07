import controller from './manage.controller';
import template from './manage.html';

export default {
  bindings: {
    backButtonText: '<',

    activationModeValues: '<',
    biosSettingsSgx: '<',
    initialActivationMode: '<',
    initialPrmrr: '<',
    prmrrValues: '<',

    goBack: '<',
    goToConfirm: '<',
  },
  controller,
  template,
};
