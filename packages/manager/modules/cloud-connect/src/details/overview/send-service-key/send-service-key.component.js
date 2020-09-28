import controller from './send-service-key.controller';
import template from './template.html';

export default {
  bindings: {
    cloudConnect: '<',
    goBack: '<',
    serviceKey: '<',
    serviceKeyId: '<',
  },
  controller,
  template,
};
