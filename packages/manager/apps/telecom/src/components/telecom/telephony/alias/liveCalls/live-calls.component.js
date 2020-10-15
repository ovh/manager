import template from './live-calls.html';
import controller from './live-calls.controller';

export default {
  bindings: {
    apiEndpoint: '<',
    queueId: '<',
  },
  template,
  controller,
};
