angular
  .module('Module.ip', [
    'Module.ip.controllers',
    'Module.ip.filters',
    'Module.ip.services',
    'ngOvhUtils',
    'ngRoute',
    'ngSanitize',
    'ui.bootstrap',
  ])
  .config([
    '$stateProvider',
    ($stateProvider) => {
      $stateProvider.state('app.ip', {
        url: '/configuration/ip?serviceName&page&pageSize',
        templateUrl: 'ip/ip.html',
        controller: 'IpMainCtrl',
        reloadOnSearch: true,
        translations: { value: ['.', './ip/reverse/update'], format: 'json' },
      });
    },
  ]);
