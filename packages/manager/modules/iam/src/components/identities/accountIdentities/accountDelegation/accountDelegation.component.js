import template from './accountDelegation.template.html';
import controller from './accountDelegation.controller';

export const name = 'iamDelegationAccount';

export default {
  bindings: {
    onClose: '&',
    onAddAccount: '&',
  },
  controller,
  template,
};
