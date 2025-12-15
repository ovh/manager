import controller from './reason-warning-modal.controller';
import template from './reason-warning-modal.html';

export default {
  bindings: {
    service: '=',
    action: '=',
  },
  name: 'reasonWarningModal',
  controller,
  template,
};
