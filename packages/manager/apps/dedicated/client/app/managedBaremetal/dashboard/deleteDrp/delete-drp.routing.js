export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.details.dashboard.deleteDrp', {
    url: '/deleteDrp',
    views: {
      modal: {
        component: 'dedicatedCloudDatacenterDrpDelete',
      },
    },
    layout: 'modal',
    resolve: {
      drpInformations: /* @ngInject */ (currentDrp, dedicatedCloudDrp) =>
        dedicatedCloudDrp.constructor.getPlanServiceInformations(currentDrp),
      breadcrumb: () => null,
    },
  });
};
