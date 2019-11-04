import template from './domain-webhosting.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('app.domain.product.webhosting', {
      url: '/webhosting',
      abstract: true,
      views: {
        'domainView@app.domain.product': {
          template,
        },
      },
    })
    .state('app.domain.alldom.webhosting', {
      url: '/webhosting',
      abstract: true,
      views: {
        'domainView@app.domain.alldom': {
          template,
        },
      },
    });
};
