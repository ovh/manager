import controller from './terminate.controller';
import template from './terminate.html';

export default {
  bindings: {
    goBack: '&',
    onError: '&',
    onSuccess: '&',
    serviceType: '@',
    terminateService: '&',
    title: '<',
    primaryDisabled: '=',
  },
  controller,
  template,
  transclude: true,
};
