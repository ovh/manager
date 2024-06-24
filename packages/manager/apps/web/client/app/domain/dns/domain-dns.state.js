import template from './DNS.html';
import controller from './domain-dns.controller';

export default /* @ngInject */ ($stateProvider) => {
  const state = {
    url: '/dns',
    views: {
      domainView: {
        controller,
        controllerAs: '$ctrl',
        template,
      },
    },
    params: {
      isSuccess: false,
    },
    atInternet: {
      rename: 'DNS',
    },
    resolve: {
      isSuccess: /* @ngInject */ ($transition$) =>
        $transition$.params().isSuccess,
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('domain_dns'),
    },
  };

  $stateProvider.state('app.domain.product.dns', { ...state });
  $stateProvider.state('app.alldom.domain.dns', { ...state });
};
