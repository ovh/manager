import controller from './controller';
import template from './template.html';

export default {
  template,
  controller,
  bindings: {
    instances: '<',
    instanceColName: '<',
    instanceColTotal: '<',
    instanceColTotalTooltip: '<',
    showSwitchToMonthlyBillingOption: '<',
    showAdditionalInstanceDetails: '<',
  },
};
