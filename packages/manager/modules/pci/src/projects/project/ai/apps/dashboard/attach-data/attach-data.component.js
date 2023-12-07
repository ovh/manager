import controller from './attach-data.controller';
import template from './attach-data.html';

export default {
  bindings: {
    app: '<',
    projectId: '<',
    trackApps: '<',
    goToManualDataSync: '<',
    dataSync: '<',
  },
  controller,
  template,
};
