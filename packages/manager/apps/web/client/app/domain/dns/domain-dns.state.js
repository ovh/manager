import template from './domain-dns.html';
import controller from './domain-dns.controller';
import { NS_UPDATE_RESULT } from '../dns-modify/domain-dns-modify.constants';

export default /* @ngInject */ ($stateProvider) => {
  const state = {
    url: '/dns',
    views: {
      domainView: {
        controller,
        controllerAs: '$ctrl',
        template,
      },
      dnsZoneView: {
        template,
        controller,
        controllerAs: '$ctrl',
      },
    },
    params: {
      /**
       * Used to display a success message comming from dns-modify page
       */
      nsUpdateStatus: NS_UPDATE_RESULT.EMPTY,
    },
    atInternet: {
      rename: 'DNS',
    },
    resolve: {
      nsUpdateStatus: /* @ngInject */ ($transition$) =>
        $transition$.params().nsUpdateStatus,
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('domain_dns'),
    },
  };

  $stateProvider.state('app.domain.product.dns', { ...state });
  $stateProvider.state('app.zone.details.dns', { ...state });
  $stateProvider.state('app.alldom.domain.dns', { ...state });
};
