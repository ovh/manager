import controller from './subscriptions.controller';
import template from './subscriptions.html';

export default {
  bindings: {
    changeOwnerUrl: '<',
    dedicatedServer: '<',
    worldPart: '<',
  },
  controller,
  template,
};
