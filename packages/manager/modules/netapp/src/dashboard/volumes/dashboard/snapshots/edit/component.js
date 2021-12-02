import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    goToSnapshots: '<',
    serviceName: '<',
    snapshot: '<',
    volumeId: '<',
    volume: '<',
    trackClick: '<',
  },
  controller,
  template,
};
