import controller from './notebook-attach.controller';
import template from './notebook-attach.html';

export default {
  bindings: {
    notebookModel: '<',
    displayNotebookAttach: '<',
    storages: '<',
  },
  require: {
    notebookAttachForm: '^form',
  },
  controller,
  template,
};
