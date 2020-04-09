import controller from './terminate.controller';
import template from './terminate.html';

export default {
  bindings: {
    domainName: '<',
    goToDns: '<',
    goBack: '<',
  },
  controller,
  template,
};
