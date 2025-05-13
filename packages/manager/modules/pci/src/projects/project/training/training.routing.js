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
      jobsLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.training.jobs', {
          projectId,
        }),
      registriesLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.training.registries', {
          projectId,
        }),
      jobInfo: /* @ngInject */ ($state, projectId) => (jobId) =>
        $state.go('pci.projects.project.training.jobs.info', {
          projectId,
          jobId,
        }),
      jobResubmit: /* @ngInject */ ($state) => (jobId) =>
        $state.go('pci.projects.project.training.jobs.resubmit', {
          jobId,
        }),
      jobKill: /* @ngInject */ ($state, projectId) => (jobId) =>
        $state.go('pci.projects.project.training.jobs.kill', {
          projectId,
          jobId,
        }),
      deleteJob: /* @ngInject */ ($state) => (jobId) =>
        $state.go('pci.projects.project.training.jobs.delete', {
          jobId,
        }),
      jobInfoLink: /* @ngInject */ ($state, projectId) => (jobId) =>
        $state.href('pci.projects.project.training.jobs.info', {
          projectId,
          jobId,
        }),
      billingLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.billing', {
          projectId,
        }),
      goToJobSubmit: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.training.jobs.submit', {
          projectId,
        }),
      submitJobLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.training.jobs.submit', {
          projectId,
        }),
      jobList: /* @ngInject */ (
        PciProjectTrainingJobService,
        projectId,
        isAuthorized,
      ) => {
        if (!isAuthorized) {
          return [];
        }
        return PciProjectTrainingJobService.getAll(projectId);
      },
      goToUsersAndTokens: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.ai-dashboard.users-tokens', {
          projectId,
        }),
      jobListRegions: /* @ngInject */ (jobList) =>
        Array.from(new Set(jobList.map(({ spec }) => spec.region))),

      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),
      allUsers: /* @ngInject */ (PciProjectTrainingService, projectId) => () =>
        PciProjectTrainingService.getAllUsers(projectId),
      regions: /* @ngInject */ (PciProjectTrainingService, projectId) =>
        PciProjectTrainingService.getRegions(projectId),
      refreshState: /* @ngInject */ ($state) => () => $state.reload(),
      trainingFeatures: /* @ngInject */ (
        PciProjectTrainingService,
        projectId,
      ) => PciProjectTrainingService.getFeatures(projectId),
      userLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.users', {
          projectId,
        }),
    },
  });
};
