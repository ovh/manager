import controller from './app-image.controller';
import template from './app-image.html';

export default {
  bindings: {
    image: '=',
    preset: '=',
    partnerConditionsAccepted: '=',
    showAdvancedImage: '=',
    presets: '<',
    prices: '<',
    flavors: '<',
    type: '<',
    defaultPrice: '<',
    command: '=',
  },
  controller,
  template,
};
