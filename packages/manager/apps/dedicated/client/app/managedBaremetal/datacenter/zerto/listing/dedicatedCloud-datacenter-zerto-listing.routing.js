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
      redirectTo: (transition) =>
        transition
          .injector()
          .getAsync('isZertoOnPremise')
          .then(
            (isZertoOnPremise) =>
              !isZertoOnPremise &&
              'app.managedBaremetal.details.datacenters.datacenter.zerto',
          ),
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
