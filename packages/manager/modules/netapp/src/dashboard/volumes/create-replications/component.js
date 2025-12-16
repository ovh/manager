import template from './template.html';
import controller from './controller';

export default {
  bindings: {
    replicationsAvaibleServices: '<',
    goToOrder: '<',
    goToVolumes: '<',
    postReplications: '<',
  },
  template,
  controller,
};
