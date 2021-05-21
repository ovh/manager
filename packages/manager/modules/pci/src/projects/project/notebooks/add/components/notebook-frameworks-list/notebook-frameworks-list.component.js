import controller from './notebook-frameworks-list.controller';
import template from './notebook-frameworks-list.html';

export default {
  bindings: {
    displayNotebookFramework: '<',
    notebookModel: '<',
    frameworks: '<',
  },
  controller,
  template,
};
