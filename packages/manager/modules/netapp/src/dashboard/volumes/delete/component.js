import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    goBack: '<',
    storage: '<',
    volumeId: '<',
    trackClick: '<',
  },
  controller,
  template,
};
