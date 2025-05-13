import template from './userIdentities.template.html';
import controller from './userIdentities.controller';

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
