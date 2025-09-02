import controller from './migrate-offer.controller';
import template from './template.html';

export default {
  bindings: {
    cloudConnect: '<',
    goBack: '<',
  },
  controller,
  template,
};
