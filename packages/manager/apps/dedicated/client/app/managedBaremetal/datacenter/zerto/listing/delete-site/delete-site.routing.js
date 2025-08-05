export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.managedBaremetal.details.datacenters.datacenter.zerto.listing.deleteSite',
    {
      url: '/delete-site/:siteId',
      views: {
        modal: {
          component: 'managedBaremetalDatacenterZertoDeleteSiteModal',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => undefined,
        siteId: /* @ngInject */ ($transition$) => $transition$.params().siteId,
        goBack: /* @ngInject */ ($state) => () =>
          $state.go('dedicated_cloud_zerto.dashboard.nodes.all'),
        handleSuccess: /* @ngInject */ (Alerter, goBack) => (message) => {
          goBack();
          Alerter.success(message, 'managedBaremetal_dashboard_alert');
        },
        handleError: /* @ngInject */ (Alerter, goBack) => (message) => {
          goBack();
          Alerter.error(message, 'managedBaremetal_dashboard_alert');
        },
        deleteSite: /* @ngInject */ (
          managedBaremetalZerto,
          serviceName,
          datacenterId,
          siteId,
        ) => () =>
          managedBaremetalZerto.deleteZertoRemoteSite({
            serviceName,
            datacenterId,
            siteId,
          }),
        zertoSite: /* @ngInject */ (zertoMultiSites, siteId) => {
          zertoMultiSites.find((site) => site.id === siteId);
        },
      },
    },
  );
};
