import controller from './overTheBox-migration-summary.controller';
import template from './overTheBox-migration-summary.html';

export default {
  controller,
  template,
  bindings: {
    serviceName: '<',
    contact: '<',
    offer: '<',
  },
};
