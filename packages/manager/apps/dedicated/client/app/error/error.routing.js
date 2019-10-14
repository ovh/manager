export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('error', {
    url: '/error',
    params: {
      detail: null,
    },
    views: {
      'app@': {
        component: 'managerDedicatedError',
      },
    },
    resolve: {
      error: /* @ngInject */ $transition$ => $transition$.params().detail,
      homeLink: /* @ngInject */ $state => $state.href('app.configuration', {}, { reload: true }),
      reload: /* @ngInject */ $window => () => $window.location.reload(),
    },
    translations: { value: ['.'], format: 'json' },
  });
};
