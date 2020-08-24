angular.module('App').config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('app', {
      abstract: true,
      resolve: {
        currentUser: /* @ngInject */ (User) => User.getUser(),
        rootState: () => 'app.configuration',
      },
      templateUrl: 'app.html',
      translations: {
        value: ['common', 'double-authentication'],
        format: 'json',
      },
      url: '',
    });

    $stateProvider.state('app.mfaEnrollment', {
      url: '/mfa-enrollment',
      views: {
        'app@': {
          component: 'mfaEnrollment',
        },
      },
      redirectTo: ($transition$) => {
        const { contracts } = $transition$.params();
        return contracts ? '' : 'app.configuration';
      },
      params: {
        forced: {
          dynamic: true,
        },
      },
      translations: { value: ['.'], format: 'json' },
      resolve: {
        forced: /* @ngInject */ ($transition$) => $transition$.params().forced,
        from: /* @ngInject */ ($transition$) => $transition$.$from().name,
      },
    });

    $stateProvider.state('app.userContracts', {
      url: '/user-contracts',
      views: {
        'app@': {
          component: 'userContracts',
        },
      },
      params: {
        contracts: null,
      },
      translations: { value: ['.'], format: 'json' },
      resolve: {
        contracts: /* @ngInject */ ($transition$) =>
          $transition$.params().contracts,
      },
    });

    // CDN & NAS
    $stateProvider.state('app.networks', {
      abstract: true,
      template: '<ui-view />',
      url: '/configuration',
    });

    // Microsoft
    $stateProvider.state('app.microsoft', {
      abstract: true,
      template: '<ui-view />',
    });
  },
);
