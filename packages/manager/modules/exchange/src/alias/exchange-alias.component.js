import controller from './exchange-alias.controller';
import template from './exchange-alias.html';

export default {
  controller,
  template,
  bindings: {
    exchange: '<',
    aliasType: '<',
    goBack: '<',
    goToAliasAdd: '<',
    goToAliasRemove: '<',
  },
};
