import controller from './overTheBox-migration.controller';
import template from './overTheBox-migration.html';

export default {
  controller,
  template,
  bindings: {
    serviceName: '<',
    goBack: '<',
  },
};
