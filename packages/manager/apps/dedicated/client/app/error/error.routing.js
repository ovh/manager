export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('error', {
    url: '/error',
    params: {
      detail: null,
    },
    views: {
      'app@': {
        component: 'managerErrorPage',
      },
    },
    resolve: {
      cancelLink: /* @ngInject */ $state => $state.href('app.configuration', { reload: true }),
      error: /* @ngInject */ $transition$ => $transition$.params(),
      submitAction: /* @ngInject */ $window => () => $window.location.reload(),
      translationsRefresh: /* @ngInject */ $translate => $translate.refresh(),
    },
  });
};
