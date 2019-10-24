import controller from './modems.controller';
import template from './modems.html';

export default {
  bindings: {
    deleteSpare: '<',
    replaceSpare: '<',
    returnMerchandise: '<',
    goToModems: '<',
    modems: '<',
    spare: '<',
  },
  controller,
  template,
};
