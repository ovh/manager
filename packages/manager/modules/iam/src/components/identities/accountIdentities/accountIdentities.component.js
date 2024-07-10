import template from './accountIdentities.template.html';
import controller from './accountIdentities.controller';

export default {
  bindings: {
    identities: '<',
    onRemoveIdentity: '&',
    readOnly: '<',
  },
  controller,
  template,
};
