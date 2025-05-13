import controller from './flavors-list.controller';
import template from './flavors-list.html';
import './style.scss';

export default {
  bindings: {
    currentFlavor: '<',
    onChange: '&?',
    flavors: '<',
    selectedFlavor: '=',
    user: '<',
    allowLowerSelection: '<?',
    showMonthlyPrices: '<?',
  },
  controller,
  template,
};
