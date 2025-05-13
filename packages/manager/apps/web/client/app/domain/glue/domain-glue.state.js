import template from './GLUE.html';

const state = {
  url: '/glue',
  views: {
    domainView: {
      template,
      controller: 'controllers.Domain.Glue',
      controllerAs: 'ctrlDomainGlue',
    },
  },
  atInternet: {
    rename: 'GLUE',
  },
  resolve: {
    breadcrumb: /* @ngInject */ ($translate) =>
      $translate.instant('domain_glue'),
  },
};

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.domain.product.glue', { ...state });
  $stateProvider.state('app.alldom.domain.glue', { ...state });
};
