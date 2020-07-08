import controller from './pack-xdsl.controller';
import template from './pack-xdsl.html';

export default {
  controller,
  template,
  bindings: {
    packName: '<',
    serviceName: '<',
    goBack: '<',
  },
};
