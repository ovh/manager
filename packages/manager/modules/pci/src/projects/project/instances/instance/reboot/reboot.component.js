import controller from './reboot.controller';
import template from './reboot.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    rebootType: '<',
    instance: '<',
    goBack: '<',
  },
};
