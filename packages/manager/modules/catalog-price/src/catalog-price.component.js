import controller from './catalog-price.controller';
import template from './catalog-price.html';
import './catalog-price.scss';

const component = {
  bindings: {
    block: '<',
    convertToUcents: '<',
    interval: '<?',
    intervalUnit: '@?',
    price: '<',
    tax: '<',
    fromToPrice: '<',
    performRounding: '<?',
    minimumFractionDigits: '<?',
    maximumFractionDigits: '<?',
    showZeroPrice: '<?',
    beta: '<?',
  },
  controller,
  template,
};

export default component;
