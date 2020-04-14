export default {
  url: '/anycast-terminate',
  views: {
    domainView: {
      component: 'domainAnycastTerminate',
    },
  },
  resolve: {
    previousState: /* @ngInject */ ($transition$) => $transition$.$from(),
    dnsAnycastDetails: /* @ngInject */ (Domain, domainName) =>
      Domain.getDnsAnycastDetails(domainName),
    setError: /* @ngInject */ (Alerter) => (message) =>
      Alerter.error(message, 'domain_alert_tabs'),
    goBack: /* @ngInject */ ($state, previousState) => () => {
      if (previousState.name) {
        $state.go(previousState.name);
      } else {
        $state.go('app.domain.product.dns');
      }
    },
  },
};
