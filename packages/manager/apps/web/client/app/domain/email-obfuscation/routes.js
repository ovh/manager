export default /* @ngInject */ ($stateProvider) => {
  const state = {
    url: '/obfuscation',
    views: {
      domainView: 'domainEmailObfuscation',
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('domain_email_obfuscation_back_button'),
    },
  };

  $stateProvider.state('app.domain.product.emailObfuscation', { ...state });
  $stateProvider.state('app.alldom.domain.emailObfuscation', { ...state });
};
