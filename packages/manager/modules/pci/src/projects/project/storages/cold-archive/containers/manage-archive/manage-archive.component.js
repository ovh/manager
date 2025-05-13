import controller from './manage-archive.controller';
import template from './manage-archive.html';

export default {
  controller,
  template,
  bindings: {
    endpoint: '<',
    regions: '<',
    trackClick: '<',
    trackPage: '<',
    goBack: '<',
  },
};
