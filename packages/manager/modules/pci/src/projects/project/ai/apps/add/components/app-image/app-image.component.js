import controller from './app-image.controller';
import template from './app-image.html';

export default {
  bindings: {
    image: '=',
    preset: '=',
    presets: '<',
    prices: '<',
    flavors: '<',
    type: '<',
    defaultPrice: '<',
  },
  controller,
  template,
};
