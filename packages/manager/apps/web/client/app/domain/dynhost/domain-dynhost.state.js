import template from './DYNHOST.html';

const state = {
  url: '/dynhost',
  views: {
    domainView: {
      template,
      controller: 'DomainTabDynHostCtrl',
    },
  },
  atInternet: {
    rename: 'DYNHOST',
  },
};

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.domain.product.dynhost', { ...state });
  $stateProvider.state('app.alldom.domain.dynhost', { ...state });
};
