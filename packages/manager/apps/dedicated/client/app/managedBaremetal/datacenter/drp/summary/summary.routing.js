export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.datacenter.drp.summary', {
    url: '/summary',
    views: {
      'innerView@app.managedBaremetal.datacenter.drp': {
        component: 'dedicatedCloudDatacenterDrpSummary',
      },
    },
    params: {
      drpInformations: {},
    },
    resolve: {
      goToDeleteDrpModal: /* @ngInject */ ($state) => () =>
        $state.go('app.managedBaremetal.datacenter.drp.summary.deleteDrp'),
    },
  });
};
