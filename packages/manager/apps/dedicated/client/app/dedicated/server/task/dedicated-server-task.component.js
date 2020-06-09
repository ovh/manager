import controller from './dedicated-server-task.controller';
import template from './dedicated-server-task.html';

export default {
  bindings: {
    serverName: '<',
  },
  controller,
  template,
};
