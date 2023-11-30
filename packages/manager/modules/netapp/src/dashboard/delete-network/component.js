import template from './template.html';
import controller from './controller';

export default {
  bindings: {
    goBack: '<',
    trackClick: '<',
    trackPage: '<',
    storage: '<',
    networkInformations: '<',
  },
  template,
  controller,
};
