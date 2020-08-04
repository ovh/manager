import controller from './regenerate-service-key.controller';
import template from './template.html';

export default {
  bindings: {
    cloudConnectId: '<',
    goBack: '<',
    serviceKey: '<',
    serviceKeyId: '<',
  },
  controller,
  template,
};
