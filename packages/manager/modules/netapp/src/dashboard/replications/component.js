import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    replications: '<',
    sourceEFSNames: '<',
    goToVolumeDetails: '<',
    goToService: '<',
  },
  controller,
  template,
};
