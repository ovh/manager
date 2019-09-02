export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecomError', {
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
      'root@': 'managerErrorPage',
    },
    resolve: {
      cancelLink: /* @ngInject */ $state => $state.href('telecom'),
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
