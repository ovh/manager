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
      redirectTo: (transition) => {
        return transition
          .injector()
          .get('$q')
          .all({
            isZertoOnPremise: transition
              .injector()
              .getAsync('isZertoOnPremise'),
          })
          .then(({ isZertoOnPremise }) => {
            return (
              isZertoOnPremise &&
              'app.managedBaremetal.details.datacenters.datacenter.zerto.listing'
            );
          });
      },
      resolve: {
        goToDeleteSiteZertoModal: /* @ngInject */ ($state) => () =>
          $state.go(
            'app.managedBaremetal.details.datacenters.datacenter.zerto.summary.deleteZerto',
          ),
        breadcrumb: () => null,
      },
    },
  );
};
