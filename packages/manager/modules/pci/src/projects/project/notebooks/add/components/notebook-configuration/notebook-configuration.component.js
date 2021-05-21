import controller from './notebook-configuration.controller';
import template from './notebook-configuration.html';

export default {
  bindings: {
    displayNotebookConfiguration: '<',
    notebookModel: '<',
    editors: '<',
  },
  controller,
  template,
};
