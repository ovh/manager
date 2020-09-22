import template from './DNSSEC.html';

const state = {
  url: '/dnssec',
  views: {
    domainView: {
      template,
      controller: 'DomainDnssecTabCtrl',
      controllerAs: 'ctrlDomainDnssec',
    },
  },
  atInternet: {
    rename: 'DNSSEC',
  },
};

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.domain.product.dnssec', { ...state });
  $stateProvider.state('app.alldom.domain.dnssec', { ...state });
};
