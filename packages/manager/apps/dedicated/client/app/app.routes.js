angular.module('App').config(
  /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
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

    $stateProvider.state('app.hpc', {
      url: '/hosted-private-cloud',
      template: '<ui-view></ui-view>',
      redirectTo: 'app.configuration',
    });

    $stateProvider.state('app.bmc', {
      url: '/bare-metal-cloud',
      template: '<ui-view />',
      redirectTo: 'app.configuration',
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

    $urlRouterProvider.when(/^\/cloud-connect\/details/, () => {
      window.location.href = window.location.href.replace(
        '/cloud-connect/details',
        '/cloud-connect',
      );
    });

    $urlRouterProvider.when(/^\/enterprise-cloud-database\/service/, () => {
      window.location.href = window.location.href.replace(
        '/enterprise-cloud-database/service',
        '/enterprise-cloud-database',
      );
    });
  },
);
