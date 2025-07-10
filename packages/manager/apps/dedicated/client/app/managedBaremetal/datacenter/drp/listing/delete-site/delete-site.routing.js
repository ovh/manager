export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.managedBaremetal.details.datacenters.datacenter.drp.listing.deleteSite',
    {
      url: '/delete-site/:siteId',
      views: {
        modal: {
          component: 'managedBaremetalDatacenterDrpDeleteSiteModal',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => undefined,
        siteId: /* @ngInject */ ($transition$) => $transition$.params().siteId,
        goBack: /* @ngInject */ ($state) => () =>
          $state.go('dedicated_cloud_drp.dashboard.nodes.all'),
        handleSuccess: /* @ngInject */ (Alerter, goBack) => (message) => {
          Alerter.success(message, 'managedBaremetal_dashboard_alert');
          goBack();
        },
        handleError: /* @ngInject */ (Alerter, goBack) => (message) => {
          Alerter.error(message, 'managedBaremetal_dashboard_alert');
          goBack();
        },
        deleteSite: /* @ngInject */ (
          managedBaremetalDrp,
          serviceName,
          datacenterId,
          siteId,
        ) => () =>
          managedBaremetalDrp.deleteZertoRemoteSite({
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
