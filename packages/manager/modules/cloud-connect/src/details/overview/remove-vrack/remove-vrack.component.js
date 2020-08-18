import controller from './remove-vrack.controller';
import template from './template.html';

export default {
  bindings: {
    cloudConnect: '<',
    goBack: '<',
    vRackId: '<',
  },
  controller,
  template,
};
