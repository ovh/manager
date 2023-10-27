import controller from './terminate.controller';
import template from './terminate.template.html';

export default {
  bindings: {
    goBack: '<',
    server: '<',
    serviceInfos: '<',
  },
  controller,
  template,
};
