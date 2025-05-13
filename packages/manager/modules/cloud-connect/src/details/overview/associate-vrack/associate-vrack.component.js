import controller from './associate-vrack.controller';
import template from './template.html';

export default {
  bindings: {
    cloudConnect: '<',
    goBack: '<',
    vRacks: '<',
    vrackOrderUrl: '<',
  },
  controller,
  template,
};
