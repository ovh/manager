import { NS_UPDATE_RESULT } from './domain-dns-modify.constants';

export const componentName = 'webDomainDnsModify';

const state = {
  url: '/dns-modify',
  views: {
    domainView: { component: componentName },
  },
  resolve: {
    previousState: /* @ngInject */ ($transition$) => $transition$.$from(),
    goBack: /* @ngInject */ ($state) => (options = {}) => {
      const mergedOptions = {
        nsUpdateStatus: NS_UPDATE_RESULT.EMPTY,
        ...options,
      };

      return $state.go('app.domain.product.dns', mergedOptions);
    },
    breadcrumb: /* @ngInject */ ($translate) =>
      $translate.instant('domain_dns_modify'),
  },
};

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.domain.product.dns_modify', { ...state });
  $stateProvider.state('app.alldom.domain.dns_modify', { ...state });
};
