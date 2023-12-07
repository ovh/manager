import controller from './attach-data.controller';
import template from './attach-data.html';

export default {
  bindings: {
    notebook: '<',
    projectId: '<',
    trackNotebooks: '<',
    goToManualDataSync: '<',
    dataSync: '<',
  },
  controller,
  template,
};
