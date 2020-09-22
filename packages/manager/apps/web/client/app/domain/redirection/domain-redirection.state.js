import template from './REDIRECTION.html';

const state = {
  url: '/redirection',
  views: {
    domainView: {
      template,
      controller: 'controllers.Domain.Redirection',
    },
  },
  atInternet: {
    rename: 'REDIRECTION',
  },
};

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.domain.product.redirection', { ...state });
  $stateProvider.state('app.alldom.domain.redirection', { ...state });
};
