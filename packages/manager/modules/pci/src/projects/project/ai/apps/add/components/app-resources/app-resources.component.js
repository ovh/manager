import controller from './app-resources.controller';
import template from './app-resources.html';

export default {
  bindings: {
    appModel: '<',
    flavors: '<',
    prices: '<',
    getPriceIndex: '<',
  },
  controller,
  template,
};
