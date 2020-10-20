import controller from './services-actions.controller';
import template from './services-actions.html';

export default {
  bindings: {
    service: '<',
    trackingPrefix: '@?',
    user: '<',
    getCommitmentLink: '&?',
  },
  controller,
  template,
};
