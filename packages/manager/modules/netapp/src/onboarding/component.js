import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    discover: '<',
    hasRecommendedSupportLevel: '<',
    goToOrder: '<',
    trackClick: '<',
  },
  controller,
  template,
};
