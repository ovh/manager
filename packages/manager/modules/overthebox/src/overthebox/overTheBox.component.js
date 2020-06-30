import controller from './overTheBox.controller';
import template from './overTheBox.html';

export default {
  controller,
  template,
  controllerAs: 'OverTheBox',
  bindings: {
    serviceName: '<',
    service: '<',
  },
};
