export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('app.domain.product.webhosting', {
      url: '/webhosting',
      abstract: true,
    })
    .state('app.alldom.domain.webhosting', {
      url: '/webhosting',
      abstract: true,
    });
};
