import controller from './disk-size.controller';
import template from './disk-size.html';
import './style.scss';

export default {
  bindings: {
    min: '<',
    max: '<',
    step: '<',
    model: '=',
    lowLimitValue: '<?',
    initialValue: '<?',
    onChange: '&?',
    prices: '<',
    nodes: '<',
    showMonthlyPrices: '<',
    showPrices: '<',
  },
  template,
  controller,
};
