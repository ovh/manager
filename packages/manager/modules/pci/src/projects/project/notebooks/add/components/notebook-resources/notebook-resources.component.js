import controller from './notebook-resources.controller';
import template from './notebook-resources.html';

export default {
  bindings: {
    displayNotebookResources: '<',
    notebookModel: '<',
    flavors: '<',
    prices: '<',
  },
  controller,
  template,
};
