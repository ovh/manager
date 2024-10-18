import controller from './flavor-billing.controller';
import template from './flavor-billing.html';

export default {
  controller,
  template,
  bindings: {
    flavor: '<',
    number: '<?',
    monthlyBilling: '=?',
    disabled: '<?',
    addons: '<?',
    isLocalZone: '<',
    hourlyPriceInformation: '<',
    onChange: '&',
  },
};
