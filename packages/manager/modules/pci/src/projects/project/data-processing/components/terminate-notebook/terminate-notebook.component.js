import template from './terminate-notebook.html';
import controller from './terminate-notebook.controller';

export default {
  controller,
  template,
  bindings: {
    goBack: '<',
    projectId: '<',
    showNotebooks: '<',
    notebookId: '<',
    notebookName: '<',
  },
};
