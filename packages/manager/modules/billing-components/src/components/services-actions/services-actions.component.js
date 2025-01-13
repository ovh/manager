import controller from './services-actions.controller';
import template from './services-actions.html';

export default {
  bindings: {
    billingManagementAvailability: '<',
    deleteVrackAvailability: '<',
    service: '<',
    trackingPrefix: '@?',
    trackingPage: '@?',
    getCommitmentLink: '&?',
    getCancelCommitmentLink: '&?',
    getCancelResiliationLink: '&?',
    getResiliationLink: '&?',
    handleGoToResiliation: '&?',
    isCustomResiliationHandled: '<?',
  },
  controller,
  template,
};
