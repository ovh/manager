import controller from './debt-warning-modal.controller';
import template from './debt-warning-modal.html';

export default {
  bindings: {
    service: '=',
  },
  name: 'debtWarningModal',
  controller,
  template,
};
