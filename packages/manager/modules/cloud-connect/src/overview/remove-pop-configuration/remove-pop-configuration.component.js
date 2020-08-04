import controller from './remove-pop-configuration.controller';
import template from './template.html';

export default {
  bindings: {
    cloudConnect: '<',
    cloudConnectId: '<',
    goBack: '<',
    interfaceId: '<',
    pop: '<',
    popId: '<',
    tasksHref: '<',
  },
  controller,
  template,
};
