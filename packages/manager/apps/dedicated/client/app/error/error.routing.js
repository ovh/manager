export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('error', {
    url: '/error',
    params: {
      detail: null,
      to: null,
    },
    views: {
      'app@': {
        component: 'managerErrorPage',
      },
    },
    resolve: {
      cancelLink: /* @ngInject */ ($state) =>
        $state.href('app.configuration', { reload: true }),
      error: /* @ngInject */ ($transition$) => $transition$.params(),
      product: /* @ngInject */ ($state, $transition$) => {
        const { state, params } = $transition$.params().to;
        // href will include # so split with '/' and take second element
        const [, product] = $state
          .href(state, params, { lossy: true })
          .split('/');
        return product;
      },
      submitAction: /* @ngInject */ ($window) => () =>
        $window.location.reload(),
      translationsRefresh: /* @ngInject */ ($translate) => $translate.refresh(),
    },
    atInternet: {
      ignore: true,
    },
  });
};
