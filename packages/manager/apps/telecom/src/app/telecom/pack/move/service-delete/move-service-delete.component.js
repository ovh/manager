import controller from './move-service-delete.controller';
import template from './move-service-delete.html';

export default {
  controller,
  template,
  bindings: {
    subServicesToDelete: '<',
  },
};
