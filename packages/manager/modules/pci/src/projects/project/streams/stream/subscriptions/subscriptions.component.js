import controller from './subscriptions.controller';
import template from './subscriptions.html';

export default {
  controller,
  template,
  bindings: {
    stream: '<',
    subscriptions: '<',
    addSubscribtionLink: '<',
    resetSubscription: '<',
    deleteSubscription: '<',
  },
};
