import { PCI_FEATURES } from '../../projects.constant';

export default /* @ngInject */ ($stateProvider) =>
  $stateProvider.state('pci.projects.project.data-processing', {
    url: '/data-processing',
    component: 'pciProjectDataProcessing',
    onEnter: /* @ngInject */ (pciFeatureRedirect) => {
      return pciFeatureRedirect(PCI_FEATURES.PRODUCTS.DATA_PROCESSING);
    },
    redirectTo: (transition) =>
      Promise.all([transition.injector().getAsync('authorization')]).then(
        ([authorization]) => {
          if (!authorization.data.authorized) {
            return { state: 'pci.projects.project.data-processing.onboarding' };
          }
          return { state: 'pci.projects.project.data-processing.home' };
        },
      ),
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('data_processing_title'),
      authorization: /* @ngInject */ (dataProcessingService, projectId) =>
        dataProcessingService.getAuthorization(projectId),
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),

      jobsLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.data-processing.jobs', {
          projectId,
        }),
      homeLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.data-processing.home', {
          projectId,
        }),
      notebooksLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.data-processing.notebooks', {
          projectId,
        }),
    },
    atInternet: {
      rename: 'public-cloud::pci::projects::project::data-processing',
    },
  });
