import template from './project-dashboard-activate-banner.html';

export default {
  bindings: {
    voucherAmout: '<',
    isManuallyReviewedByAntiFraud: '<',
    onClick: '&',
  },
  template,
};
