import { countAiItems } from '../ai-dashboard.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.ai-dashboard.onboarding', {
    url: '/onboarding',
    component: 'pciProjectAiDashboardOnboarding',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('aiItems')
        .then((items) =>
          countAiItems(items) > 0
            ? { state: 'pci.projects.project.ai-dashboard' }
            : false,
        ),
    resolve: {
      breadcrumb: /* @ngInject */ () => null, // Hide breadcrumb
    },
  });
};
