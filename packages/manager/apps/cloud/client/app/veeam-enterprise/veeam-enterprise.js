angular.module('managerApp').config(($stateProvider) => {
  $stateProvider
    .state('paas.veeam-enterprise', {
      abstract: true,
      url: '/veeam-enterprise/{serviceName}',
      templateUrl: 'app/veeam-enterprise/veeam-enterprise.html',
      controller: 'VeeamEnterpriseCtrl',
      controllerAs: '$ctrl',
      translations: {
        value: ['../common', '.'],
        format: 'json',
      },
    })
    .state('paas.veeam-enterprise.dashboard', {
      url: '/dashboard',
      views: {
        veeamEnterpriseContent: {
          templateUrl: 'app/veeam-enterprise/dashboard/veeam-enterprise-dashboard.html',
          controller: 'VeeamEnterpriseDashboardCtrl',
          controllerAs: '$ctrl',
        },
      },
      translations: {
        value: ['../common', '.', './dashboard'],
        format: 'json',
      },
    });
});
