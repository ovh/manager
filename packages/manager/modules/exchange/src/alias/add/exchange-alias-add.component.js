import controller from './exchange-alias-add.controller';
import template from './exchange-alias-add.html';

export default {
  controller,
  template,
  bindings: {
    goBack: '<',
    aliasType: '<',
  },
};
