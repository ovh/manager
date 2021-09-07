import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    goBack: '<',
    serviceName: '<',
    volumeId: '<',
    snapshot: '<',
  },
  controller,
  template,
};
