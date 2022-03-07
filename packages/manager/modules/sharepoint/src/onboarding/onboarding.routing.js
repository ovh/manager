export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sharepoint.onboarding', {
    url: '/onboarding',
    component: 'sharepointOnboardingComponent',
    resolve: {
      hideBreadcrumb: () => true,
    },
  });
};
