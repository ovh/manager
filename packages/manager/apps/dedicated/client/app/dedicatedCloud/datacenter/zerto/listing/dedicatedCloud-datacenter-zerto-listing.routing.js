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
              return 'app.dedicatedCloud.details.datacenter.details.zerto';
            return (
              shouldBeConfigured &&
              'app.dedicatedCloud.details.datacenter.details.zerto.summary'
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
