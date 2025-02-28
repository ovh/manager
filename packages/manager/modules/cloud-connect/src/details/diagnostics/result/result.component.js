import controller from './result.controller';
import template from './template.html';

export default {
  bindings: {
    cloudConnect: '<',
    goBack: '<',
    diagnosticId: '<',
    diagnostic: '<',
  },
  controller,
  template,
};
