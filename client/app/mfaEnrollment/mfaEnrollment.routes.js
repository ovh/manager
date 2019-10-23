export default /* @ngInject */ ($stateProvider) => {
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
      forced: /* @ngInject */ $transition$ => $transition$.params().forced,
      from: /* @ngInject */ $transition$ => $transition$.$from().name,
    },
  });
};
