import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    goBack: '<',
    storage: '<',
    volumeId: '<',
  },
  controller,
  template,
};
