import controller from './subscriptions.controller';
import template from './subscriptions.html';

export default {
  controller,
  template,
  bindings: {
    stream: '<',
    subscriptions: '<',
    getSubscriptionDetails: '<',
    addSubscribtionLink: '<',
    resetSubscription: '<',
    deleteSubscription: '<',
  },
};
