import template from './terminate-notebook.html';
import controller from './terminate-notebook.controller';

const component = {
  bindings: {
    goBack: '<',
    projectId: '<',
    notebookId: '<',
    notebookName: '<',
    trackNotebooks: '<',
  },
  template,
  controller,
};

export default component;
