import template from './confirmation.html';

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
};
