export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nasha.onboarding', {
    url: '/onboarding',
    component: 'nashaOnboarding',
    resolve: {
      breadcrumb: () => null,
    },
  });
};
