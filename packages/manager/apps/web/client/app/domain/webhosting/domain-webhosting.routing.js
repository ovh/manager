export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('app.domain.product.webhosting', {
      url: '/webhosting',
      abstract: true,
    })
    .state('app.domain.alldom.webhosting', {
      url: '/webhosting',
      abstract: true,
    });
};
