import template from './GLUE.html';

const state = {
  url: '/glue',
  views: {
    domainView: {
      template,
      controller: 'controllers.Domain.Glue',
    },
  },
  atInternet: {
    rename: 'GLUE',
  },
};

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.domain.product.glue', { ...state });
  $stateProvider.state('app.alldom.domain.glue', { ...state });
};
