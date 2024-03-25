import { PCI_FEATURES } from '../../projects.constant';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.training', {
    url: '/training',
    component: 'pciProjectTraining',
    onEnter: /* @ngInject */ (pciFeatureRedirect) => {
      return pciFeatureRedirect(PCI_FEATURES.PRODUCTS.TRAINING);
    },
    redirectTo: (transition) =>
      Promise.all([
        transition.injector().getAsync('lab'),
        transition.injector().getAsync('isAuthorized'),
      ]).then(([lab, isAuthorized]) => {
        if (!isAuthorized || lab.isOpen()) {
          return { state: 'pci.projects.project.training.onboarding' };
        }
        return { state: 'pci.projects.project.training.jobs' };
      }),
    resolve: {
      lab: /* @ngInject */ (
        PciProjectLabsService,
        projectId,
        trainingFeatures,
        $q,
      ) => {
        // If the product is on lab mode, we retrieve lab data
        if (trainingFeatures.lab) {
          return PciProjectLabsService.getLabByName(projectId, 'ai-training');
        }
        // Else we return an activated lab
        return $q.resolve({
          isOpen: () => false,
          isActivated: () => true,
        });
      },
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_projects_project_training_title'),
      isAuthorized: /* @ngInject */ (PciProjectTrainingService, projectId) =>
        PciProjectTrainingService.isAuthorized(projectId),
      trainingFeatures: /* @ngInject */ (
        PciProjectTrainingService,
        projectId,
      ) => PciProjectTrainingService.getFeatures(projectId),
    },
  });
};
