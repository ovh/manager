export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.managedBaremetal.details.datacenters.datacenter.zerto.listing',
    {
      url: '/listing',
      views: {
        'pccDatacenterView@app.managedBaremetal.details.datacenters.datacenter': {
          component: 'dedicatedCloudDatacenterZertoListing',
        },
      },
      params: {},

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
              !isZertoOnPremise &&
              'app.managedBaremetal.details.datacenters.datacenter.zerto'
            );
          });
      },
      resolve: {
        breadcrumb: () => null,
        openDeleteSiteModal: /* @ngInject */ (
          $state,
          serviceName,
          datacenterId,
        ) => (siteId) =>
          $state.go(
            'app.managedBaremetal.details.datacenters.datacenter.zerto.listing.deleteSite',
            { serviceName, datacenterId, siteId },
          ),
      },
    },
  );
};
