import controller from './catalog-price.controller';
import template from './catalog-price.html';

const component = {
  bindings: {
    block: '<',
    convertToUcents: '<',
    interval: '<?',
    price: '<',
    tax: '<',
    user: '<',
    fromToPrice: '<',
    performRounding: '<?',
    minimumFractionDigits: '<?',
    maximumFractionDigits: '<?',
  },
  controller,
  template,
};

export default component;
