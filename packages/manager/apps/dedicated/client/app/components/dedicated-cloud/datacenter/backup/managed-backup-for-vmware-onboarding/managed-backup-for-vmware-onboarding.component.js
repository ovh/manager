import controller from './managed-backup-for-vmware-onboarding.controller';
import template from './managed-backup-for-vmware-onboarding.html';

export default {
  bindings: {
    orderUrl: '<',
    trackingPrefix: '<',
  },
  controller,
  template,
};
