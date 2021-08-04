import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    goBack: '<',
    goToVolumeDetails: '<',
    storage: '<',
    volumes: '<',
    protocolEnum: '<',
    trackClick: '<',
  },
  controller,
  template,
};
