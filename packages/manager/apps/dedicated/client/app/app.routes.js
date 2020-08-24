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
      redirectTo: ($transition$) => {
        const { contracts } = $transition$.params();
        return contracts ? false : 'app.configuration';
      },
      views: {
        'app@': {
          component: 'userContracts',
        },
      },
      params: {
        contracts: null,
      },
      resolve: {
        contracts: /* @ngInject */ ($transition$) =>
          $transition$.params().contracts,
        from: /* @ngInject */ () => 'app.configuration',
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
