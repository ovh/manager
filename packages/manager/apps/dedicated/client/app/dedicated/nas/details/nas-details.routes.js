angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.networks.nas.details', {
    url: '/:nasType/:nasId',
    reloadOnSearch: false,
    params: {
      nasType: 'nas',
    },
    resolve: {
      nasData() {
        return {
          nas: {},
          information: null,
          monitoring: {},
        };
      },
    },
    views: {
      nasView: {
        templateUrl: 'dedicated/nas/details/nas-details.html',
        controller: 'NasDetailsCtrl',
        controllerAs: '$ctrl',
      },
      'nasDetails@app.networks.nas.details': {
        templateUrl:
          'dedicated/nas/details/dashboard/nas-details-dashboard.html',
        controller: 'NasDetailsDashboardCtrl',
        controllerAs: '$ctrl',
      },
    },
  });
});
