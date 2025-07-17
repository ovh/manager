const moduleName = 'dedicatedCloudDatacenterDashboardDeleteZertoModule';

angular.module(moduleName, []).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state(
      'app.dedicatedCloud.details.datacenter.details.dashboard.deleteZerto',
      {
        url: '/deleteZerto',
        views: {
          modal: {
            component: 'dedicatedCloudDatacenterZertoDelete',
          },
        },
        layout: 'modal',
        resolve: {
          zertoInformations: /* @ngInject */ (
            currentZerto,
            dedicatedCloudZerto,
          ) =>
            dedicatedCloudZerto.constructor.getPlanServiceInformations(
              currentZerto,
            ),

          goBack: /* @ngInject */ ($state) => () => $state.go('^'),
          breadcrumb: () => null,
        },
      },
    );
  },
);

export default moduleName;
