export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('error', {
    url: '/error',
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
    views: {
      'root@': 'managerErrorPage',
    },
    resolve: {
      cancelLink: /* @ngInject */ $state => $state.href('home'),
      error: /* @ngInject */ ($transition$) => {
        const stateParams = $transition$.params();
        const error = {
          ...stateParams,
          code: stateParams.code,
        };

        return error;
      },
      submitAction: /* @ngInject */ $window => () => $window.location.reload(),
      translationsRefresh: /* @ngInject */ $translate => $translate.refresh(),
    },
  });
};
