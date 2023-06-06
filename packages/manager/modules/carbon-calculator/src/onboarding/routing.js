export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.onboarding', {
    url: '/onboarding',
    component: 'carbonCalculatorOnboarding',
    resolve: {
      breadcrumb: () => null,
    },
  });
};
