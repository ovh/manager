export default /* @ngInject */ ($stateProvider) => {
  const state = {
    url: '/optin',
    views: {
      domainView: 'domainOptin',
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('domain_optin_back_button'),
    },
  };

  $stateProvider.state('app.domain.product.optin', { ...state });
  $stateProvider.state('app.alldom.domain.optin', { ...state });
};
