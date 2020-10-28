import associateIpBloc from './ip/associate-ip-bloc';

angular
  .module('Module.ip', [
    associateIpBloc,
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
        reloadOnSearch: false,
        translations: { value: ['.', './ip/reverse/update'], format: 'json' },
      });
    },
  ]);
