import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    storage: '<',
    volumeId: '<',
    trackClick: '<',
    goToVolumes: '<',
  },
  controller,
  template,
};
