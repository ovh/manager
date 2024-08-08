import template from './template.html';
import controller from './controller';

export default {
  bindings: {
    storage: '<',
    volume: '<',
    remainingQuota: '<',
    trackClick: '<',
    goBack: '<',
  },
  template,
  controller,
};
