import { PCI_FEATURES } from '../../projects.constant';

export default /* @ngInject */ ($stateProvider) =>
  $stateProvider.state('pci.projects.project.data-processing', {
    url: '/data-processing?id',
    component: 'pciProjectDataProcessing',
    params: {
      id: {
        dynamic: true,
        type: 'string',
      },
    },
    onEnter: /* @ngInject */ (pciFeatureRedirect) => {
      return pciFeatureRedirect(PCI_FEATURES.PRODUCTS.DATA_PROCESSING);
    },
    redirectTo: (transition) =>
      Promise.all([transition.injector().getAsync('authorization')]).then(
        ([authorization]) => {
          if (!authorization.data.authorized) {
            return { state: 'pci.projects.project.data-processing.onboarding' };
          }
          return false;
        },
      ),
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('data_processing_title'),
      authorization: /* @ngInject */ (dataProcessingService, projectId) =>
        dataProcessingService.getAuthorization(projectId),
      submitJob: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.data-processing.submit-job', {
          projectId,
        }),
      showJob: /* @ngInject */ ($state, projectId) => (jobId) =>
        $state.go(
          'pci.projects.project.data-processing.job-details.dashboard',
          {
            projectId,
            jobId,
          },
          {
            reload: true,
          },
        ),
      showJobs: /* @ngInject */ ($state, projectId) => () =>
        $state.go(
          'pci.projects.project.data-processing',
          { projectId },
          {
            reload: true,
          },
        ),
      terminateJob: /* @ngInject */ ($state, projectId) => (jobId, jobName) => {
        $state.go('pci.projects.project.data-processing.terminate', {
          projectId,
          jobId,
          jobName,
        });
      },
      jobId: /* @ngInject */ ($transition$) => $transition$.params().id,
      lab: /* @ngInject */ (PciProjectLabsService, projectId) =>
        PciProjectLabsService.getLabByName(projectId, 'dataProcessing'),
    },
    atInternet: {
      rename: 'public-cloud::pci::projects::project::data-processing',
    },
  });
