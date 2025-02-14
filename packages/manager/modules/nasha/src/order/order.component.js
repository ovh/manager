import controller from './order.controller';
import template from './order.template.html';

export default {
  bindings: {
    goToNasha: '<',
    trackClick: '<',
    nashaPublicUrl: '<',
    setupNasHa: '<',
  },
  controller,
  template,
};
