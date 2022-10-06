import controller from './taskPollProgress.controller';
import template from './taskPollProgress.html';

export default {
  bindings: {
    dedicatedCloud: '<',
    loaders: '=',
    productId: '<',
    task: '=',
    trackingTaskTag: '<',
    trackPage: '<',
  },
  controller,
  template,
};
