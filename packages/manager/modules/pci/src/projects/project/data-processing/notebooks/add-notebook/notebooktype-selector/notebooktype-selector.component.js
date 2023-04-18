import controller from './notebooktype-selector.controller';
import template from './notebooktype-selector.html';

export default {
  template,
  controller,
  bindings: {
    onChangeHandler: '<',
    notebookEngines: '<',
  },
};
