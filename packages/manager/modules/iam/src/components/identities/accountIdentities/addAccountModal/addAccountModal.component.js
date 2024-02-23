import controller from './addAccountModal.controller';
import template from './addAccountModal.template.html';
import './addAccountModal.styles.scss';

export default {
  bindings: {
    close: '<',
    onAddAccount: '<',
  },
  controller,
  template,
};
