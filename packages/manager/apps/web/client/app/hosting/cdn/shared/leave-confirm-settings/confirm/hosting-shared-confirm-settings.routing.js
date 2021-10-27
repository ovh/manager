export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard.cdn.shared.confirmSettings', {
    url: '',
    views: {
      modal: {
        component: 'managerHostingSharedConfirmSettings',
      },
    },
    params: {
      model: null,
      oldModel: null,
      rules: null,
    },
    layout: 'modal',
    resolve: {
      applyChanges: /* @ngInject */ (
        $q,
        $transition$,
        HostingCdnSharedService,
      ) => (settings) =>
        $q.all(
          settings.map(({ name: settingName, ...settingProperties }) =>
            HostingCdnSharedService.updateCDNDomainOption(
              $transition$.params().productId,
              $transition$.params().domainName,
              settingName,
              settingProperties,
            ),
          ),
        ),

      goBack: /* @ngInject */ ($state) => () => $state.go('^'),

      model: /* @ngInject */ ($transition$) => $transition$.params().model,

      oldModel: /* @ngInject */ ($transition$) =>
        $transition$.params().oldModel,

      refresh: /* @ngInject */ ($transition$, HostingCdnSharedService) => () =>
        HostingCdnSharedService.appliedCdnSettings(
          $transition$.params().productId,
          $transition$.params().domainName,
        ),

      rules: /* @ngInject */ ($transition$) => $transition$.params().rules,
    },
    atInternet: {
      rename: 'web::hosting::cdn::configure::apply-configuration',
    },
  });
};
