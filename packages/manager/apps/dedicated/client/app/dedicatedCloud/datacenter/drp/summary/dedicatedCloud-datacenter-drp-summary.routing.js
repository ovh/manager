export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.datacenter.drp.summary', {
    url: '/summary',
    views: {
      'innerView@app.dedicatedClouds.datacenter.drp': {
        component: 'dedicatedCloudDatacenterDrpSummary',
      },
    },
    params: {
      drpInformations: {},
    },
    resolve: {
      goToDeleteDrpModal: /* @ngInject */ ($state) => () =>
        $state.go('app.dedicatedClouds.datacenter.drp.summary.deleteDrp'),
    },
  });
};
