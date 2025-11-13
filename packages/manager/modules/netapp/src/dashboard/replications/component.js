import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    getShareReplication: '<',
    goToVolumeDetails: '<',
  },
  controller,
  template,
};
