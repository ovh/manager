import controller from './disk-size.controller';
import template from './disk-size.html';
import './style.scss';

export default {
  bindings: {
    min: '<',
    max: '<',
    step: '<',
    model: '=',
    initialValue: '<?',
    onChange: '&?',
    prices: '<',
    nodes: '<',
    showMonthlyPrices: '<',
  },
  template,
  controller,
};
