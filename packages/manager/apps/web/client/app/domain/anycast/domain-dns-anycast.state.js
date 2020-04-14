const state = {
  url: '/dns-anycast',
  views: {
    domainView: {
      component: 'domainAnycast',
    },
  },
  resolve: {
    getDnsAnycast: /* @ngInject */ (Domain, domainName) =>
      Domain.getDetails(domainName, ['dnsanycast']).then(
        ({ dnsanycast }) => dnsanycast,
      ),
    previousState: /* @ngInject */ ($transition$) => $transition$.$from(),
    goBack: /* @ngInject */ ($state, previousState) => () => {
      if (previousState.name) {
        $state.go(previousState.name);
      } else {
        $state.go('^');
      }
    },
    breadcrumb: /* @ngInject */ ($translate) =>
      $translate.instant('domain_anycast'),
  },
};

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.domain.product.anycast', { ...state });
  $stateProvider.state('app.alldom.domain.anycast', { ...state });
};
