export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.datacenter.details.drp.listing.deleteSite',
    {
      url: '/delete-site/:siteId',
      views: {
        modal: {
          component: 'dedicatedCloudDatacenterDrpDeleteSiteModal',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => undefined,
        siteId: /* @ngInject */ ($transition$) => $transition$.params().siteId,
        goBack: /* @ngInject */ ($state) => (reload = false) =>
          $state.go(
            'app.dedicatedCloud.details.datacenter.details.drp.listing',
            undefined,
            { reload },
          ),
        handleSuccess: /* @ngInject */ (Alerter, goBack) => (message) => {
          Alerter.success(message, 'dedicatedCloud_dashboard_alert');
          goBack(true);
        },
        handleError: /* @ngInject */ (Alerter, goBack) => (message) => {
          Alerter.error(message, 'dedicatedCloud_dashboard_alert');
          goBack();
        },
        deleteSite: /* @ngInject */ (
          dedicatedCloudDrp,
          serviceName,
          datacenterId,
          siteId,
        ) => () =>
          dedicatedCloudDrp.deleteZertoRemoteSite({
            serviceName,
            datacenterId,
            siteId,
          }),
        zertoSite: /* @ngInject */ (zertoMultiSites, siteId) =>
          zertoMultiSites.find((site) => site.id === Number(siteId)),
      },
    },
  );
};
