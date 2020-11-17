const moduleName = 'managedBaremetalDatacenterDashboardDeleteDrpModule';

angular.module(moduleName, []).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state(
      'app.managedBaremetal.datacenter.dashboard.deleteDrp',
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
        },
      },
    );
  },
);

export default moduleName;
