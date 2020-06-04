import controller from './detach.controller';
import template from './detach.html';

export default {
  bindings: {
    detachZoneOptions: '<',
    goBack: '<',
    serviceInfos: '<',
    user: '<',
  },
  controller,
  template,
};
