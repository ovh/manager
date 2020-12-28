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
  },
  controller,
  template,
  transclude: true,
};
