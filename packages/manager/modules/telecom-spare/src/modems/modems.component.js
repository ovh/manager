import controller from './modems.controller';
import template from './modems.html';

export default {
  bindings: {
    deleteSpare: '<',
    goToModems: '<',
    modems: '<',
    orderNewModem: '<',
    replaceSpare: '<',
    returnMerchandise: '<',
    spare: '<',
  },
  controller,
  template,
};
