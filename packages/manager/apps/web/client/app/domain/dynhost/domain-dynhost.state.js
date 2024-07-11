import template from './DYNHOST.html';

const state = {
  url: '/dynhost',
  views: {
    domainView: {
      template,
      controller: 'DomainTabDynHostCtrl',
      controllerAs: 'ctrlDomainDynHost',
    },
  },
  atInternet: {
    rename: 'DYNHOST',
  },
  resolve: {
    breadcrumb: /* @ngInject */ ($translate) =>
      $translate.instant('domain_dynhost'),
  },
};

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.domain.product.dynhost', { ...state });
  $stateProvider.state('app.alldom.domain.dynhost', { ...state });
};
