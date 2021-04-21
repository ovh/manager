import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    prices: '<',
    selectedPlan: '<',
    changeOffer: '<',
    user: '<',
  },
  controller,
  template,
};
