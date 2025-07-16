export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.datacenter.details.zerto.listing',
    {
      url: '/listing',
      views: {
        'pccDatacenterView@app.dedicatedCloud.details.datacenter.details': {
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
              'app.dedicatedCloud.details.datacenter.details.zerto',
          ),
      resolve: {
        breadcrumb: () => null,
        openDeleteSiteModal: /* @ngInject */ (
          $state,
          serviceName,
          datacenterId,
        ) => (siteId) =>
          $state.go(
            'app.dedicatedCloud.details.datacenter.details.zerto.listing.deleteSite',
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
