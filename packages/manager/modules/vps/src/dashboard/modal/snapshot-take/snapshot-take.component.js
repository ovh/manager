import controller from './snapshot-take.controller';
import template from './snapshot-take.html';

export default {
  bindings: {
    goBack: '<',
    serviceName: '<',
  },
  controller,
  template,
};
