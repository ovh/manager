import template from './delete-notebook.html';
import controller from './delete-notebook.controller';

const component = {
  bindings: {
    goBack: '<',
    projectId: '<',
    showNotebooks: '<',
    notebookId: '<',
    notebookName: '<',
    trackNotebooks: '<',
  },
  template,
  controller,
};

export default component;
