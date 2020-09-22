export default /* @ngInject */ ($stateProvider) => {
  const state = {
    url: '/obfuscation',
    views: {
      domainView: 'domainEmailObfuscation',
    },
  };

  $stateProvider.state('app.domain.product.emailObfuscation', { ...state });
  $stateProvider.state('app.alldom.domain.emailObfuscation', { ...state });
};
