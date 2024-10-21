import template from './template.html';
import controller from './controller';

export default {
  controller,
  template,
  bindings: {
    proof: '@',
    userType: '@',
    extended: '<',
    isLoaded: '<',
    kycStatus: '<',
    isValid: '<',
    onClick: '&',
  },
};
