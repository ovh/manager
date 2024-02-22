import template from './template.html';
import controller from './controller';

export default {
  bindings: {
    goBack: '<',
    trackClick: '<',
    trackSuccess: '<',
    trackError: '<',
    goToVrackOrder: '<',
    availableVracks: '<',
    networkInformations: '<',
  },
  template,
  controller,
};
