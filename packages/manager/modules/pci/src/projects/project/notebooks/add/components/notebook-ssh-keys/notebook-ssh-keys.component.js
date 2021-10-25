import controller from './notebook-ssh-keys.controller';
import template from './notebook-ssh-keys.html';

export default {
  bindings: {
    notebookModel: '<',
    displayNotebookSshKeys: '<',
    projectId: '<',
  },
  require: {},
  controller,
  template,
};
