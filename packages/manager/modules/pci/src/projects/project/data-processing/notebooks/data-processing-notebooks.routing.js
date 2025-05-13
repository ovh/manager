import {
  DATA_PROCESSING_TRACKING_PREFIX,
  DATA_PROCESSING_TRACKING_PREFIX_FULL,
} from '../data-processing.constants';

export default /* @ngInject */ ($stateProvider) =>
  $stateProvider.state('pci.projects.project.data-processing.notebooks', {
    url: '/notebooks?id',
    component: 'pciProjectDataProcessingNotebooks',
    params: {
      id: {
        dynamic: true,
        type: 'string',
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('data_processing_notebooks'),
      addNotebook: /* @ngInject */ ($state, projectId) => () =>
        $state.go(
          'pci.projects.project.data-processing.notebooks.add-notebook',
          {
            projectId,
          },
        ),
      showNotebook: /* @ngInject */ ($state, projectId) => (notebookId) =>
        $state.go(
          'pci.projects.project.data-processing.notebooks.details',
          {
            projectId,
            notebookId,
          },
          {
            reload: true,
          },
        ),
      showNotebooks: /* @ngInject */ ($state, projectId) => () =>
        $state.go(
          'pci.projects.project.data-processing.notebooks',
          { projectId },
          {
            reload: true,
          },
        ),
      terminateNotebook: /* @ngInject */ ($state, projectId) => (
        notebookId,
      ) => {
        $state.go('pci.projects.project.data-processing.notebooks.terminate', {
          projectId,
          notebookId,
        });
      },
      deleteNotebook: /* @ngInject */ ($state, projectId) => (
        notebookId,
        notebookName,
      ) => {
        $state.go('pci.projects.project.data-processing.notebooks.delete', {
          projectId,
          notebookId,
          notebookName,
        });
      },
      reloadState: /* @ngInject */ ($state) => () => {
        $state.go($state.current, {}, { reload: true });
      },
      notebooks: /* @ngInject */ (dataProcessingService, projectId) =>
        dataProcessingService.getNotebooks(projectId).then((data) => data),
      notebookId: /* @ngInject */ ($transition$) => $transition$.params().id,
      lab: /* @ngInject */ (PciProjectLabsService, projectId) =>
        PciProjectLabsService.getLabByName(projectId, 'dataProcessing'),
      notebooksTrackPrefix: () =>
        `${DATA_PROCESSING_TRACKING_PREFIX_FULL}::notebooks`,
      trackNotebooks: /* @ngInject */ (
        notebooksTrackPrefix,
        trackClick,
        trackPage,
      ) => (complement, type = 'action', prefix = true) => {
        const name = `${
          prefix ? `${notebooksTrackPrefix}::` : ''
        }${complement}`;
        switch (type) {
          case 'action':
          case 'navigation':
            trackClick(name, type);
            break;
          case 'page':
            trackPage(name);
            break;
          default:
            trackClick(name);
        }
      },
      trackClick: /* @ngInject */ (atInternet) => (hit, type = 'action') => {
        atInternet.trackClick({
          name: hit,
          type,
        });
      },
      trackPage: /* @ngInject */ (atInternet) => (hit) => {
        atInternet.trackPage({
          name: hit,
        });
      },
    },
    atInternet: {
      rename: `${DATA_PROCESSING_TRACKING_PREFIX}::notebooks`,
    },
  });
