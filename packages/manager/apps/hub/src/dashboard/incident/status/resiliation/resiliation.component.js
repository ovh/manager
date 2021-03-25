import controller from './resiliation.controller';
import template from './template.html';

export default {
  bindings: {
    service: '<',
    goBack: '<',
    askForResiliation: '<',
  },
  controller,
  template,
};
