import template from './subscriptions.html';

export default {
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
