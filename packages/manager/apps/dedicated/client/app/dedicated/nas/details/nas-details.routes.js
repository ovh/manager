export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated-nas.details', {
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
      dashboardLink: /* @ngInject */ ($state, $transition$) =>
        $state.href('app.dedicated-nas.details', $transition$.params()),
      partitionLink: /* @ngInject */ ($state, $transition$) =>
        $state.href(
          'app.dedicated-nas.details.partition',
          $transition$.params(),
        ),
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),
      nasId: /* @ngInject */ ($transition$) => $transition$.params().nasId,
      breadcrumb: /* @ngInject */ (nasId) => nasId,
    },
    views: {
      nasView: {
        templateUrl: 'dedicated/nas/details/nas-details.html',
        controller: 'NasDetailsCtrl',
        controllerAs: '$ctrl',
      },
      'nasDetails@app.dedicated-nas.details': {
        templateUrl:
          'dedicated/nas/details/dashboard/nas-details-dashboard.html',
        controller: 'NasDetailsDashboardCtrl',
        controllerAs: '$ctrl',
      },
    },
  });
};
