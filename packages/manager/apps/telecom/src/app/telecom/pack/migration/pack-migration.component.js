import controller from './pack-migration.controller';
import template from './pack-migration.html';

export default {
  controller,
  template,
  bindings: {
    packName: '<',
    goBack: '<',
  },
};
