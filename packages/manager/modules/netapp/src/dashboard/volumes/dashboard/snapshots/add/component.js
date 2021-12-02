import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    serviceName: '<',
    volumeId: '<',
    volume: '<',
    trackClick: '<',
    goToSnapshots: '<',
  },
  controller,
  template,
};
