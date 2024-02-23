import template from './groupIdentities.template.html';
import controller from './groupIdentities.controller';

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
