import controller from './increase-request-credits.controller';
import template from './increase-request-credits.html';

export default {
  controller,
  template,
  bindings: {
    goBack: '<',
    projectId: '<',
    region: '<',
    trackPage: '<',
    trackClick: '<',
    guideUrl: '<',
  },
};
