import controller from './overTheBox-autoconfigure.controller';
import template from './template.html';

export default {
  controller,
  template,
  bindings: {
    serviceName: '<',
  },
};
