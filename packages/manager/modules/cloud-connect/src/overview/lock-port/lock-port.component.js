import controller from './lock-port.controller';
import template from './template.html';

export default {
  bindings: {
    cloudConnect: '<',
    goBack: '<',
    interfaceId: '<',
    interface: '<',
    tasksHref: '<',
  },
  controller,
  template,
};
