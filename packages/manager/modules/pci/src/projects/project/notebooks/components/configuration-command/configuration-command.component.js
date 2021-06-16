import controller from './configuration-command.controller';
import template from './configuration-command.html';

export default {
  bindings: {
    notebookSpecs: '<',
    projectId: '<',
  },
  controller,
  template,
};
