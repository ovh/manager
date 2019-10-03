import controller from './modems.controller';
import template from './modems.html';

export default {
  bindings: {
    modems: '<',
    deleteSpare: '<',
    goToModems: '<',
  },
  controller,
  template,
};
