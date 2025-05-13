export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.datacenter.details.drp.summary',
    {
      url: '/summary',
      views: {
        'innerView@app.dedicatedCloud.details.datacenter.details.drp': {
          component: 'dedicatedCloudDatacenterDrpSummary',
        },
      },
      params: {
        drpInformations: {},
      },
      resolve: {
        goToDeleteDrpModal: /* @ngInject */ ($state) => () =>
          $state.go(
            'app.dedicatedCloud.details.datacenter.details.drp.summary.deleteDrp',
          ),
        breadcrumb: () => null,
      },
    },
  );
};
