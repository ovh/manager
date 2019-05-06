import controller from './onboarding.controller';
import template from './onboarding.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.onboarding', {
      url: '/onboarding',
      controller,
      controllerAs: '$ctrl',
      template,
      resolve: {
        breadcrumb: () => null, // Hide breadcrumb
      },
    });
};
