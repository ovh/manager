import template from './softphone.html';
import controller from './softphone.controller';

export default {
  controller,
  template,
  bindings: {
    currentServiceIsBeta: '<',
  },
};
