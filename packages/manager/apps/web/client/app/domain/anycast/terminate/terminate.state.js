const state = {
  url: '/anycast-terminate',
  views: {
    domainView: {
      component: 'domainAnycastTerminate',
    },
    dnsZoneView: {
      component: 'domainAnycastTerminate',
    },
  },
  resolve: {
    domainName: /* @ngInject */ ($transition$) =>
      $transition$.params().productId,
    previousState: /* @ngInject */ ($transition$) => $transition$.$from(),
    dnsAnycastDetails: /* @ngInject */ (Domain, domainName) =>
      Domain.getDnsAnycastDetails(domainName),
    setError: /* @ngInject */ (Alerter) => (message) =>
      Alerter.error(message, 'domain.terminateDnsAnycast'),
    goBack: /* @ngInject */ ($state, previousState) => () => {
      return $state.go(
        previousState.name
          ? previousState.name
          : 'app.domain.product.information',
      );
    },
    breadcrumb: /* @ngInject */ ($translate) =>
      $translate.instant('domain_configuration_dnsanycast_terminate_title'),
  },
};

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.domain.product.terminate_anycast', { ...state });
  $stateProvider.state('app.zone.details.terminate_anycast', { ...state });
  $stateProvider.state('app.alldom.domain.terminate_anycast', { ...state });
};
