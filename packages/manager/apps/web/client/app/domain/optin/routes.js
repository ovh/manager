export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.domain.product.optin', {
    url: '/optin',
    views: {
      domainView: 'domainOptin',
    },
    translations: { value: ['.'], format: 'json' },
  });

  $stateProvider.state('app.alldom.domain.optin', {
    url: '/optin',
    views: {
      domainView: 'domainOptin',
    },
    translations: { value: ['.'], format: 'json' },
  });
};
