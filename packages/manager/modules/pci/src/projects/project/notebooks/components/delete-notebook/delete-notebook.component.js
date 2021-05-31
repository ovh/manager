import controller from './delete-notebook.controller';
import template from './delete-notebook.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    notebook: '<',
    goBack: '<',
    trackNotebooks: '<',
    trackingPrefix: '<',
  },
};
