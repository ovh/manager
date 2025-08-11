export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.datacenter.details.zerto.listing.addSite',
    {
      url: '/add-site',
      views: {
        'pccDatacenterView@app.dedicatedCloud.details.datacenter.details': {
          component: 'dedicatedCloudDatacenterZertoAddSite',
        },
      },
      params: {
        zertoInformations: {},
      },
      resolve: {
        breadcrumb: () => null,
        zertoSiteId: /* @ngInject */ ($transition$) =>
          $transition$.params().zertoSiteId,
        zertoSite: /* @ngInject */ (zertoSiteId, zertoMultiSites) =>
          zertoMultiSites.find(({ id }) => id === Number(zertoSiteId)),
        goBackToListing: /* @ngInject */ ($state) => (reload = false) =>
          $state.go(
            'app.dedicatedCloud.details.datacenter.details.zerto.listing',
            undefined,
            { reload },
          ),
        handleSuccess: /* @ngInject */ (Alerter, goBackToListing) => (
          message,
        ) => {
          goBackToListing(true).then(() =>
            Alerter.success(message, 'dedicatedCloud_dashboard_alert'),
          );
        },
      },
    },
  );
};
