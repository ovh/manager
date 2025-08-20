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
            shouldBeConfigured: transition
              .injector()
              .getAsync('shouldBeConfigured'),
          })
          .then(({ isZertoOnPremise, shouldBeConfigured }) => {
            if (!isZertoOnPremise)
              return 'app.managedBaremetal.details.datacenters.datacenter.zerto';
            return (
              shouldBeConfigured &&
              'app.managedBaremetal.details.datacenters.datacenter.zerto.summary'
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
        zertoMultiSites: /* @ngInject */ (
          dedicatedCloudZerto,
          serviceName,
          datacenterId,
        ) =>
          dedicatedCloudZerto.getZertoMultiSite({
            serviceName,
            datacenterId,
          }),
      },
    },
  );
};
