import template from './index.html';
import controller from './controller';

export default {
  name: 'pciBillingColdArchiveList',
  controller,
  template,
  bindings: {
    resourceUsage: '<',
    currencySymbol: '<',
  },
};
