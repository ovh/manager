import template from './template.html';
import controller from './controller';

export default {
  controller,
  template,
  transclude: {
    title: '?title',
    description: '?description',
  },
  bindings: {
    logSubscriptionUrl: '<',
    kind: '<',
    title: '@',
    description: '@',
  },
};
