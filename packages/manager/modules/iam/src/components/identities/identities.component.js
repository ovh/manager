import controller from './identities.controller';
import template from './identities.template.html';

export default {
  bindings: {
    identities: '<',
    onRemove: '&',
    onAdd: '&',
    readOnly: '<',
  },
  controller,
  template,
};
