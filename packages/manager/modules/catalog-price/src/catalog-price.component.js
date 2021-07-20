import controller from './catalog-price.controller';
import template from './catalog-price.html';

const component = {
  bindings: {
    block: '<',
    convertToUcents: '<',
    interval: '<?',
    intervalUnit: '@?',
    price: '<',
    tax: '<',
    user: '<',
    fromToPrice: '<',
    performRounding: '<?',
    minimumFractionDigits: '<?',
    maximumFractionDigits: '<?',
    showZeroPrice: '<?',
  },
  controller,
  template,
};

export default component;
