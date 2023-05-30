const moduleName = 'managedBaremetalDatacenterDashboardDeleteDrpModule';

angular.module(moduleName, []).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state(
      'app.managedBaremetal.details.datacenters.datacenter.dashboard.deleteDrp',
      {
        url: '/deleteDrp',
        views: {
          modal: {
            component: 'dedicatedCloudDatacenterDrpDelete',
          },
        },
        layout: 'modal',
        resolve: {
          drpInformations: /* @ngInject */ (currentDrp, dedicatedCloudDrp) =>
            dedicatedCloudDrp.constructor.getPlanServiceInformations(
              currentDrp,
            ),

          goBack: /* @ngInject */ ($state) => () => $state.go('^'),
          breadcrumb: () => null,
        },
      },
    );
  },
);

export default moduleName;
