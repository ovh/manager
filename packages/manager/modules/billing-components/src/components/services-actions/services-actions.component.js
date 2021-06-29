import controller from './services-actions.controller';
import template from './services-actions.html';

export default {
  bindings: {
    service: '<',
    trackingPrefix: '@?',
    getCommitmentLink: '&?',
    getCancelCommitmentLink: '&?',
    getCancelResiliationLink: '&?',
    getResiliationLink: '&?',
  },
  controller,
  template,
};
