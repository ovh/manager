export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.error', {
    params: {
      code: {
        type: 'any',
      },
      context: {
        type: 'any',
      },
      detail: null,
      message: {
        type: 'any',
      },
    },
    url: '/error',
    views: {
      'app@': 'managerErrorPage',
    },
    resolve: {
      cancelLink: /* @ngInject */ $state => $state.href('app'),
      error: /* @ngInject */ ($transition$) => {
        const stateParams = $transition$.params();
        const error = {
          ...stateParams,
          code: stateParams.code,
        };

        return error;
      },
      submitAction: /* @ngInject */ $window => () => $window.location.reload(),
    },
  });
};
