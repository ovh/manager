import UserModel from './user/User.class';

let alreadyShowMFA = false;
angular
  .module('App')
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider.state('app', {
      abstract: true,
      resolve: {
        currentUser: /* @ngInject */ User => User.getUser()
          .then(user => new UserModel(user)),
        enrollMFA: /* @ngInject */ ($q, $state, OvhApiAuth) => OvhApiAuth.v6()
          .shouldDisplayMFAEnrollment()
          .$promise
          .then((shouldDisplayMFA) => {
            if ((shouldDisplayMFA.value === 'true' || shouldDisplayMFA.value === 'forced')
                && !alreadyShowMFA) {
              alreadyShowMFA = true;
              $state.go('app.mfaEnrollment', {
                forced: shouldDisplayMFA.value === 'forced',
              });
            }
          }).catch(() => $q.resolve()),
        rootState: () => 'app.configuration',
      },
      templateUrl: 'app.html',
      translations: { value: ['common', 'double-authentication', 'user-contracts'], format: 'json' },
      url: '',
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
  });
