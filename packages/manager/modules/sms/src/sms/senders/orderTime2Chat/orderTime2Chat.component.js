import controller from './orderTime2Chat.controller';
import template from './orderTime2Chat.html';

export default {
  bindings: {
    goToDashboard: '<',
    serviceName: '<',
    trackClick: '<',
  },
  controller,
  template,
};
