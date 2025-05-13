import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    goToVolumeDetails: '<',
    storage: '<',
    volumes: '<',
    protocolEnum: '<',
    trackClick: '<',
    goToVolumes: '<',
  },
  controller,
  template,
};
