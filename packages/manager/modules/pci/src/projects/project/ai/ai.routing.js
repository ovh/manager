import { PCI_FEATURES } from '../../projects.constant';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.ai', {
    url: '/ai',
    component: 'pciProjectAi',
    onEnter: /* @ngInject */ (pciFeatureRedirect) => {
      return pciFeatureRedirect(PCI_FEATURES.PRODUCTS.AI_APPS);
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('isAuthorized')
        .then((isAuthorized) => {
          if (!isAuthorized) {
            return { state: 'pci.projects.project.training.onboarding' };
          }

          return { state: 'pci.projects.project.ai.apps' };
        }),
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_ai_title'),
      isAuthorized: /* @ngInject */ (PciProjectAiService, projectId) =>
        PciProjectAiService.isAuthorized(projectId),
    },
  });
};
