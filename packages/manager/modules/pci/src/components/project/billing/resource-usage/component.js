import template from './index.html';
import controller from './controller';

export default {
  name: 'pciBillingResourceUsage',
  controller,
  template,
  bindings: {
    resourceUsage: '<',
    currencySymbol: '<',
  },
};
