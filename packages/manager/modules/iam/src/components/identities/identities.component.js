import controller from './identities.controller';
import template from './identities.template.html';

export default {
  bindings: {
    alert: '<',
    identities: '<',
    addIdentities: '<',
    removeIdentity: '<',
    readOnly: '<?',
  },
  controller,
  template,
};
