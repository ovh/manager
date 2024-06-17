export const componentName = 'domainDnsModify';

const state = {
  url: '/dns-modify',
  views: {
    domainView: { component: componentName },
  },
  resolve: {
    previousState: /* @ngInject */ ($transition$) => $transition$.$from(),
    goBack: /* @ngInject */ ($state, previousState) => () => {
      return $state.go(
        previousState.name ? previousState.name : 'app.domain.product.dns',
      );
    },
    breadcrumb: /* @ngInject */ ($translate) =>
      $translate.instant('domain_dns_modify'),
  },
};

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.domain.product.dns_modify', { ...state });
  $stateProvider.state('app.alldom.domain.dns_modify', { ...state });
};
