export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.managedBaremetal.details.datacenters.datacenter.drp.summary',
    {
      url: '/summary',
      views: {
        'innerView@app.managedBaremetal.details.datacenters.datacenter.drp': {
          component: 'dedicatedCloudDatacenterDrpSummary',
        },
      },
      params: {
        drpInformations: {},
      },
      resolve: {
        goToDeleteDrpModal: /* @ngInject */ ($state) => () =>
          $state.go(
            'app.managedBaremetal.details.datacenters.datacenter.drp.summary.deleteDrp',
          ),
        breadcrumb: () => null,
      },
    },
  );
};
