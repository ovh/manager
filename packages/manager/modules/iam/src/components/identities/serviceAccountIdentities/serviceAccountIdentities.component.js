import template from './serviceAccountIdentities.template.html';
import controller from './serviceAccountIdentities.controller';

export default {
  bindings: {
    identities: '<',
    onRemoveIdentity: '&',
    onAddIdentities: '&',
    readOnly: '<',
  },
  controller,
  template,
};
