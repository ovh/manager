angular.module('managerApp').config(($stateProvider) => {
  $stateProvider
    .state('paas.veeam', {
      url: '/veeam',
      templateUrl: 'app/veeam/veeam.html',
      abstract: true,
      translations: {
        value: ['../common', '.'],
        format: 'json',
      },
    })
    .state('paas.veeam.detail', {
      url: '/{serviceName}',
      views: {
        veeamContainer: {
          templateUrl: 'app/veeam/veeam-detail.html',
          controller: 'VeeamDetailCtrl',
          controllerAs: 'VeeamDetailCtrl',
        },
      },
      translations: {
        value: ['../common', '.'],
        format: 'json',
      },
    })
    .state('paas.veeam.detail.dashboard', {
      url: '/dashboard',
      views: {
        veeamHeader: {
          templateUrl: 'app/veeam/header/veeam-dashboard-header.html',
          controller: 'VeeamDashboardHeaderCtrl',
          controllerAs: 'VeeamDashboardHeaderCtrl',
        },
        veeamContent: {
          templateUrl: 'app/veeam/dashboard/veeam-dashboard.html',
          controller: 'VeeamDashboardCtrl',
          controllerAs: '$ctrl',
        },
      },
      translations: {
        value: ['../common', '.', './dashboard', './storage/add', './dashboard/update-offer'],
        format: 'json',
      },
    })
    .state('paas.veeam.detail.storage', {
      url: '/storage',
      views: {
        veeamHeader: {
          templateUrl: 'app/veeam/header/veeam-dashboard-header.html',
          controller: 'VeeamDashboardHeaderCtrl',
          controllerAs: 'VeeamDashboardHeaderCtrl',
        },
        veeamContent: {
          templateUrl: 'app/veeam/storage/veeam-storage.html',
          controller: 'VeeamStorageCtrl',
          controllerAs: 'VeeamStorageCtrl',
        },
      },
      translations: {
        value: ['../common', '.', './storage', './storage/add'],
        format: 'json',
      },
    });
});
