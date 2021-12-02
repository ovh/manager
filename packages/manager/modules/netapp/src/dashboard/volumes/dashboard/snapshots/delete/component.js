import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    serviceName: '<',
    volumeId: '<',
    snapshot: '<',
    trackClick: '<',
    goToSnapshots: '<',
  },
  controller,
  template,
};
