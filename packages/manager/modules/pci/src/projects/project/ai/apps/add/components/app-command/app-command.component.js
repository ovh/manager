import controller from './app-command.controller';
import template from './app-command.html';

export default {
  bindings: {
    appSpecs: '<',
    projectId: '<',
  },
  controller,
  template,
};
