export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.managedBaremetal.datacenter.drp.summary.deleteDrp',
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
          dedicatedCloudDrp.constructor.getPlanServiceInformations(currentDrp),

        goBack: /* @ngInject */ ($state) => () => $state.go('^'),
      },
    },
  );
};
