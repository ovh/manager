import template from './REDIRECTION.html';

const state = {
  url: '/redirection',
  views: {
    domainView: {
      template,
      controller: 'controllers.Domain.Redirection',
      controllerAs: 'ctrlDomainRedirect',
    },
    dnsZoneView: {
      template,
      controller: 'controllers.Domain.Redirection',
      controllerAs: 'ctrlDomainRedirect',
    },
  },
  atInternet: {
    rename: 'REDIRECTION',
  },
  resolve: {
    breadcrumb: /* @ngInject */ ($translate) =>
      $translate.instant('domain_redirection'),
  },
};

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.domain.product.redirection', { ...state });
  $stateProvider.state('app.alldom.domain.redirection', { ...state });
  $stateProvider.state('app.zone.details.redirection', { ...state });
};
