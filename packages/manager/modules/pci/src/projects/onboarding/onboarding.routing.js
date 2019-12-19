import controller from './onboarding.controller';
import template from './onboarding.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.onboarding', {
      url: '/onboarding',
      views: {
        '@pci': {
          controller,
          controllerAs: '$ctrl',
          template,
        },
      },
      resolve: {
        breadcrumb: () => null, // Hide breadcrumb
      },
      redirectTo: (transition) => transition.injector().get('publicCloud')
        .getDefaultProject()
        .then((projectId) => (projectId ? ({
          state: 'pci.projects.project',
          params: {
            projectId,
          },
        }) : null)),
    });
};
