export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard.cdn.shared', {
    url: '/shared/settings/:domainName',
    params: {
      domain: null,
    },
    views: {
      '@app.hosting.dashboard': {
        component: 'hostingCdnSharedSettings',
      },
    },
    resolve: {
      goBack: /* @ngInject */ (goToHosting) => goToHosting,

      domainName: /* @ngInject */ ($transition$) =>
        $transition$.params().domainName,

      domainOptions: /* @ngInject */ (
        HostingCdnSharedService,
        serviceName,
        domainName,
      ) =>
        HostingCdnSharedService.getCDNDomainsOptions(
          serviceName,
          domainName,
        ).then(({ data }) => data),

      cdnDetails: /* @ngInject */ (
        HostingCdnSharedService,
        serviceName,
        domainName,
      ) =>
        HostingCdnSharedService.getSharedCDNDomainDetails(
          serviceName,
          domainName,
        ).then(({ data }) => data),

      availableOptions: /* @ngInject */ (
        HostingCdnSharedService,
        serviceName,
      ) =>
        HostingCdnSharedService.getSharedCDNAvailableOptions(serviceName).then(
          ({ data }) => data,
        ),

      displayCreateCacheRuleModal: /* @ngInject */ ($state) => (params) =>
        $state.go('app.hosting.dashboard.cdn.shared.addCacheRule', params),

      displayUpdateCacheRuleModal: /* @ngInject */ ($state) => (params) =>
        $state.go('app.hosting.dashboard.cdn.shared.editCacheRule', params),

      displayConfirmSettingsModal: /* @ngInject */ ($state) => (params) =>
        $state.go('app.hosting.dashboard.cdn.shared.confirmSettings', params),

      displayLeaveSettingsModal: /* @ngInject */ ($state) => (params) =>
        $state.go('app.hosting.dashboard.cdn.shared.leaveSettings', {
          model: params,
        }),

      trackClick: /* @ngInject */ (atInternet) => (hit) => {
        atInternet.trackClick({
          name: hit,
          type: 'action',
        });
      },
    },
    atInternet: {
      rename: 'web::hosting::cdn::configure',
    },
  });
};
