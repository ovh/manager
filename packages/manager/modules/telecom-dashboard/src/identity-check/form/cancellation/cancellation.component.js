import controller from './cancellation.controller';
import template from './cancellation.html';

export default {
  bindings: {
    goBack: '<',
    procedureId: '<',
    trackClick: '<',
    trackPage: '<',
  },
  controller,
  template,
};
