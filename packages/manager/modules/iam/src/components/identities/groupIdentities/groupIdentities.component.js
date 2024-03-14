import template from './groupIdentities.template.html';
import controller from './groupIdentities.controller';

export default {
  bindings: {
    identities: '<',
    onRemoveIdentity: '&',
    readOnly: '<',
  },
  controller,
  template,
};
