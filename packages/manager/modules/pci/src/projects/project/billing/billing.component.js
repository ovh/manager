import controller from './billing.controller';
import template from './billing.html';

export default {
  bindings: {
    billingLink: '<',
    consumption: '<',
    consumptionDetails: '<',
    currentActiveLink: '<',
    guideUrl: '<',
    historyLink: '<',
    projectId: '<',
  },
  controller,
  template,
};
