const moduleName = 'managedBaremetalDatacenterDashboardDeleteZertoModule';

angular.module(moduleName, []).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state(
      'app.managedBaremetal.details.datacenters.datacenter.dashboard.deleteZerto',
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
