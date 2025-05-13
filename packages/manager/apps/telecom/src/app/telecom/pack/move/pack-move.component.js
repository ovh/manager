import controller from './pack-move.controller';
import template from './pack-move.html';

export default {
  controller,
  template,
  bindings: {
    packName: '<',
    goBack: '<',
  },
};
