import template from './index.html';
import controller from './controller';

export default {
  name: 'pciBillingPrivateRegistry',
  controller,
  template,
  bindings: {
    privateRegistry: '<',
    currencySymbol: '<',
  },
};
