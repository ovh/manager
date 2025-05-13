import controller from './detail.controller';
import template from './detail.html';

export default {
  controller,
  template,
  bindings: {
    packName: '<',
    serviceName: '<',
    goBack: '<',
  },
};
