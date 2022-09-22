import controller from './update-scaling.controller';
import template from './update-scaling.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    app: '<',
    goBack: '<',
    trackApps: '<',
    trackingPrefix: '<',
    prices: '<',
  },
};
