export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard.cdn.shared.cors', {
    url: '',
    layout: 'modal',
    params: {
      cors: null,
    },
    views: {
      modal: {
        component: 'hostingCdnSharedSettingsCors',
      },
    },
    resolve: {
      cors: /* @ngInject */ ($transition$) => $transition$.params().cors,
      goBack: /* @ngInject */ ($state) => () => $state.go('^'),

      onValidate: /* @ngInject */ (cors, goBack) => (origins) => {
        const allOrigins = Array.isArray(origins) && origins.length === 0;
        Object.assign(
          cors.config,
          allOrigins ? { origins: '*' } : { origins: origins.join(',') },
        );
        return goBack();
      },
    },
  });
};
