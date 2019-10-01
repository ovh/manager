import template from './error.html';
import controller from './error.controller';

angular.module('managerApp').config(($stateProvider) => {
  // account module
  $stateProvider.state('error', {
    url: '/error',
    params: {
      error: null,
    },
    template,
    controller,
    controllerAs: '$ctrl',
    translations: {
      value: ['.'],
      format: 'json',
    },
  });
});
