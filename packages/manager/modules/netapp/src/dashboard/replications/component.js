import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    replications: '<',
    sourceEfsNames: '<',
    goToVolumeDetails: '<',
    goToService: '<',
    currentServiceName: '<',
  },
  controller,
  template,
};
