import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    selectedPlan: '<',
    prices: '<',
  },
  controller,
  template,
};
