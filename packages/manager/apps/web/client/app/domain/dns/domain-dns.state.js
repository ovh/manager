import controller from './domain-dns.controller';
import template from './DNS.html';

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
    atInternet: {
      rename: 'DNS',
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('domain_dns'),
    },
  };

  $stateProvider.state('app.domain.product.dns', { ...state });
  $stateProvider.state('app.alldom.domain.dns', { ...state });
};
