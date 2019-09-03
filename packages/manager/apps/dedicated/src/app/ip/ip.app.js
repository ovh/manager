angular
  .module('Module.ip', ['ovh-utils-angular', 'ngRoute', 'ui.bootstrap', 'ngSanitize', 'Module.ip.controllers', 'Module.ip.services', 'Module.ip.filters'])
  .config([
    '$stateProvider',
    function ($stateProvider) {
      $stateProvider.state('app.ip', {
        url: '/configuration/ip?serviceName',
        templateUrl: 'ip/ip.html',
        controller: 'IpMainCtrl',
        reloadOnSearch: false,
        translations: { value: ['.', './ip/reverse/update'], format: 'json' },
      });
    },
  ]);
