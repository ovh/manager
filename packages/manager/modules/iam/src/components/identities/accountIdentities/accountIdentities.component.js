import template from './accountIdentities.template.html';
import controller from './accountIdentities.controller';

export default {
  bindings: {
    identities: '<',
    removeIdentity: '<',
    addIdentities: '<',
    readOnly: '<',
  },
  controller,
  template,
};
