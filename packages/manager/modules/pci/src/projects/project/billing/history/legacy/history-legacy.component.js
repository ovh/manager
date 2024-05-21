import controller from './history-legacy.controller';
import template from './history-legacy.html';

export default {
  bindings: {
    isTrustedZone: '<',
    validParams: '<',
    isSubsidiaryWithPostPaidUsageBilling: '<',
  },
  controller,
  template,
};
