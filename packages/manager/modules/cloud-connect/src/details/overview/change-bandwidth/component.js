import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    cloudConnect: '<',
    goBack: '<',
    serviceId: '<',
  },
  controller,
  template,
};
