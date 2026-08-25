import controller from './cloud-web-migration.controller';
import template from './cloud-web-migration.html';

export default {
  controller,
  template,
  bindings: {
    goBack: '<',
    serviceName: '<',
    trackClick: '<',
  },
};
