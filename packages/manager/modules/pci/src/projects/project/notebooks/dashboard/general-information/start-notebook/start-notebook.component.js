import controller from './start-notebook.controller';
import template from './start-notebook.html';

export default {
  controller,
  template,
  bindings: {
    goBack: '<',
    projectId: '<',
    notebookId: '<',
    notebook: '<',
  },
};
