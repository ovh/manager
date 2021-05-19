import controller from './add.controller';
import template from './add.html';

export default {
  bindings: {
    guideUrl: '<',
    onNotebookAdd: '<',
    projectId: '<',
    trackNotebooks: '<',
  },
  controller,
  template,
};
