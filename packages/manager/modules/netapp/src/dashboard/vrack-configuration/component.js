import template from './template.html';
import controller from './controller';

export default {
  bindings: {
    goBack: '<',
    trackClick: '<',
    trackPage: '<',
    availableVracks: '<',
    networkInformations: '<',
  },
  template,
  controller,
};
