export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.managedBaremetal.details.datacenters.datacenter.zerto.listing.addSite',
    {
      url: '/add-site',
      views: {
        'pccDatacenterView@app.managedBaremetal.details.datacenters.datacenter': {
          component: 'dedicatedCloudDatacenterZertoAddSite',
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
              !isZertoOnPremise &&
              'app.managedBaremetal.details.datacenters.datacenter.zerto'
            );
          });
      },
      resolve: {
        breadcrumb: () => null,
        zertoSiteId: /* @ngInject */ ($transition$) =>
          $transition$.params().zertoSiteId,
        zertoSite: /* @ngInject */ (zertoSiteId, zertoMultiSites) =>
          zertoMultiSites.find(({ id }) => id === Number(zertoSiteId)),
        goBackToListing: /* @ngInject */ ($state) => (reload = false) =>
          $state.go(
            'app.managedBaremetal.details.datacenters.datacenter.zerto.listing',
            undefined,
            { reload },
          ),
        handleSuccess: /* @ngInject */ (Alerter, goBackToListing) => (
          message,
        ) => {
          goBackToListing(true).then(() =>
            Alerter.success(message, 'managedBaremetal_dashboard_alert'),
          );
        },
      },
    },
  );
};
