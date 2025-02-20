import template from './auto-renew-service-modal.html';
import controller from './auto-renew-service-modal.controller';

export default {
  template,
  controller,
  bindings: {
    onClose: '&',
    service: '<',
  },
};
