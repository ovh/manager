import controller from './edit-urls.controller';
import template from './edit-urls.html';

export default {
  controller,
  template,
  bindings: {
    domainName: '<',
    model: '<',
    trackClick: '<',
    goBack: '<',
  },
};
