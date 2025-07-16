export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.managedBaremetal.details.datacenters.datacenter.zerto.summary',
    {
      url: '/summary',
      views: {
        'innerView@app.managedBaremetal.details.datacenters.datacenter.zerto': {
          component: 'dedicatedCloudDatacenterZertoSummary',
        },
      },
      params: {
        zertoInformations: {},
      },
      redirectTo: (transition) =>
        transition
          .injector()
          .getAsync('isZertoOnPremise')
          .then(
            (isZertoOnPremise) =>
              isZertoOnPremise &&
              'app.managedBaremetal.details.datacenters.datacenter.zerto.listing',
          ),
      resolve: {
        goToDeleteZertoModal: /* @ngInject */ ($state) => () =>
          $state.go(
            'app.managedBaremetal.details.datacenters.datacenter.zerto.summary.deleteZerto',
          ),
        breadcrumb: () => null,
      },
    },
  );
};
