import template from './confirmation.html';
import controller from './confirmation.controller';

export default {
  bindings: {
    activationMode: '<',
    prmrr: '<',
    /** @type {SgxConfirmationType} */
    type: '<',

    confirm: '<',
    goBack: '<',
  },
  template,
  controller,
};
